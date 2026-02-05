import { QueryClient } from '@tanstack/react-query';

import { FlowProgressActivity } from '@app/abstract/lib/types/entity';
import {
  AppletDetailsDto,
  AppletRespondentMetaDto,
} from '@app/shared/api/services/IAppletService';
import {
  CompletedEntityDto,
  EntitiesCompletionsDto,
} from '@app/shared/api/services/IEventsService';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { GroupUtility } from '@app/widgets/activity-group/model/factories/GroupUtility';
import { getFlowRecordKey } from '@app/widgets/survey/lib/storageHelpers';
import { FlowState } from '@app/widgets/survey/lib/useFlowStorageRecord';
import { buildActivityFlowPipeline } from '@app/widgets/survey/model/pipelineBuilder';
import { IAppletProgressSyncService } from '@entities/applet/model/services/IAppletProgressSyncService';
import { AvailableToEvaluator } from '@entities/event/model/AvailableToEvaluator';
import { mapEventFromDto } from '@entities/event/model/mappers';

import { AppletDetails } from '../../lib/types';
import { mapAppletDetailsFromDto } from '../mappers';
import { appletActions, UpsertEntityProgressionPayload } from '../slice';

export class ProgressSyncService implements IAppletProgressSyncService {
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;
  private queryClient: QueryClient;

  constructor(
    state: RootState,
    dispatch: AppDispatch,
    logger: ILogger,
    queryClient: QueryClient,
  ) {
    this.logger = logger;
    this.dispatch = dispatch;
    this.state = state;
    this.queryClient = queryClient;
  }

  private async syncWithAppletDto(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
  ) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);

    // Get respondentSubjectId from cache for normalization
    const queryDataUtils = new QueryDataUtils(this.queryClient);
    const respondentMeta = queryDataUtils.getRespondentMeta(appletDetails.id);
    const respondentSubjectId = respondentMeta?.subjectId ?? null;

    try {
      const { activities, activityFlows } = appletCompletions;

      [...activities, ...activityFlows].forEach(completionDto => {
        // Normalize targetSubjectId to null for self-reports (matching web's approach)
        const normalizedTargetSubjectId =
          completionDto.targetSubjectId === respondentSubjectId
            ? null
            : completionDto.targetSubjectId;

        this.upsertEntityProgression(appletDetails, {
          ...completionDto,
          targetSubjectId: normalizedTargetSubjectId,
        });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        '[ProgressSyncService.syncWithAppletDto]: Error occurred during sync progress entities:\n\n' +
          errorMessage,
      );
    }
  }

  private upsertEntityProgression(
    appletDetails: AppletDetails,
    completedEntityDto: CompletedEntityDto,
  ) {
    const isFlow = appletDetails.activityFlows.find(
      flow => flow.id === completedEntityDto.id,
    );

    // Backend provides accurate startTime and endTime timestamps
    // For in-progress flows, endTime reflects when the flow was last updated
    const payload: UpsertEntityProgressionPayload = {
      appletId: appletDetails.id,
      entityType: isFlow ? 'activityFlow' : 'activity',
      entityId: completedEntityDto.id,
      eventId: completedEntityDto.scheduledEventId,
      targetSubjectId: completedEntityDto.targetSubjectId,
      endAt: completedEntityDto.endTime, // Use real timestamp from backend
      submitId: completedEntityDto.submitId,
    };

    // Handle in-progress flows
    if (isFlow && completedEntityDto.isFlowCompleted === false) {
      const flowDetails = this.getFlowDetailsForInProgress(
        completedEntityDto,
        completedEntityDto.id,
        appletDetails,
      );

      if (flowDetails) {
        payload.isInProgress = true;
        payload.activityFlowOrder = completedEntityDto.activityFlowOrder ?? 0;
        payload.currentActivityId = flowDetails.currentActivityId;
        payload.currentActivityName = flowDetails.currentActivityName;
        payload.currentActivityDescription =
          flowDetails.currentActivityDescription;
        payload.currentActivityImage = flowDetails.currentActivityImage;
        payload.totalActivitiesInPipeline = flowDetails.totalActivities;
        // Use flow start time for consistency with web implementation
        payload.currentActivityStartAt = completedEntityDto.startTime;

        // Calculate availableUntilTimestamp for in-progress flows
        const availableUntilTimestamp = this.evaluateAvailableTo(
          appletDetails.id,
          completedEntityDto.scheduledEventId,
        );
        payload.availableUntilTimestamp = availableUntilTimestamp;

        this.logger.log(
          `[ProgressSyncService.upsertEntityProgression]: In-progress flow detected - ${flowDetails.currentActivityName} (${(payload.activityFlowOrder ?? 0) + 1}/${flowDetails.totalActivities}), availableUntil=${availableUntilTimestamp ? new Date(availableUntilTimestamp).toISOString() : 'null'}`,
        );

        // Reconstruct FlowState from server data so the flow can be resumed
        this.reconstructFlowState(
          appletDetails,
          completedEntityDto,
          flowDetails,
        );
      } else {
        this.logger.warn(
          `[ProgressSyncService.upsertEntityProgression]: Skipping in-progress flow with invalid data`,
        );
        return;
      }
    } else if (isFlow && completedEntityDto.isFlowCompleted === true) {
      // Flow is completed - check if we should clean up local FlowState storage
      // Don't clean up if user has restarted the flow locally (local start is AFTER server completion)
      const existingProgression = this.state.applets.entityProgressions?.find(
        p =>
          p.appletId === appletDetails.id &&
          p.entityType === 'activityFlow' &&
          p.entityId === completedEntityDto.id &&
          p.eventId === completedEntityDto.scheduledEventId &&
          p.targetSubjectId === completedEntityDto.targetSubjectId,
      );

      const serverCompletionTime = completedEntityDto.endTime;
      const localStartTime = existingProgression?.startedAtTimestamp;

      // Only clean up if server completion is NOT older than local start
      // (i.e., skip cleanup if flow was restarted locally after this server completion)
      if (!localStartTime || serverCompletionTime >= localStartTime) {
        const key = getFlowRecordKey(
          completedEntityDto.id,
          appletDetails.id,
          completedEntityDto.scheduledEventId,
          completedEntityDto.targetSubjectId,
        );
        const storage =
          getDefaultStorageInstanceManager().getFlowProgressStorage();
        storage.delete(key);
      }
    }

    this.dispatch(appletActions.upsertEntityProgression(payload));
  }

  /**
   * Calculates the availableUntilTimestamp for a given event.
   * Returns null if the event is not found or is AlwaysAvailable.
   */
  private evaluateAvailableTo(
    appletId: string,
    eventId: string,
  ): number | null {
    try {
      const queryDataUtils = new QueryDataUtils(this.queryClient);
      const eventDto = queryDataUtils.getEventDto(appletId, eventId);

      if (!eventDto) {
        this.logger.warn(
          `[ProgressSyncService.evaluateAvailableTo]: Event not found - appletId=${appletId}, eventId=${eventId}`,
        );
        return null;
      }

      const event = mapEventFromDto(eventDto);
      const availableToEvaluator = new AvailableToEvaluator(GroupUtility);
      const availableToDate = availableToEvaluator.evaluate(event);

      return availableToDate?.getTime() ?? null;
    } catch (error) {
      this.logger.warn(
        `[ProgressSyncService.evaluateAvailableTo]: Error calculating availableUntil - ${error}`,
      );
      return null;
    }
  }

  /**
   * Derives activity details for in-progress flows from server's activityFlowOrder.
   * Returns null if data is invalid (flow not found, invalid order, or out of bounds).
   */
  private getFlowDetailsForInProgress(
    completedEntityDto: CompletedEntityDto,
    flowId: string,
    appletDetails: AppletDetails,
  ): {
    currentActivityId: string;
    currentActivityName: string;
    currentActivityDescription: string;
    currentActivityImage: string | null;
    totalActivities: number;
  } | null {
    const flow = appletDetails.activityFlows.find(f => f.id === flowId);
    if (!flow) {
      this.logger.warn(
        `[ProgressSyncService.getFlowDetailsForInProgress] Flow ${flowId} not found in applet ${appletDetails.id}`,
      );
      return null;
    }

    const activityFlowOrder = completedEntityDto.activityFlowOrder;

    if (
      activityFlowOrder === null ||
      activityFlowOrder === undefined ||
      activityFlowOrder < 0
    ) {
      this.logger.warn(
        `[ProgressSyncService.getFlowDetailsForInProgress] Invalid activityFlowOrder: ${activityFlowOrder}`,
      );
      return null;
    }

    // activityFlowOrder is 1-indexed, so it equals the 0-indexed position of the NEXT activity to complete
    const activityIndex = activityFlowOrder;

    if (activityIndex >= flow.activityIds.length) {
      this.logger.warn(
        `[ProgressSyncService.getFlowDetailsForInProgress] activityFlowOrder ${activityFlowOrder} exceeds flow length ${flow.activityIds.length}`,
      );
      return null;
    }

    const currentActivityId = flow.activityIds[activityIndex];
    const activity = appletDetails.activities.find(
      a => a.id === currentActivityId,
    );

    if (!activity) {
      this.logger.warn(
        `[ProgressSyncService.getFlowDetailsForInProgress] Activity ${currentActivityId} not found in applet`,
      );
    }

    return {
      currentActivityId,
      currentActivityName: activity?.name || 'Unknown Activity',
      currentActivityDescription: activity?.description || '',
      currentActivityImage: activity?.image || null,
      totalActivities: flow.activityIds.length,
    };
  }

  /**
   * Reconstructs FlowState from server data and saves to storage
   * so the flow can be resumed from the correct activity.
   */
  private reconstructFlowState(
    appletDetails: AppletDetails,
    completedEntityDto: CompletedEntityDto,
    _flowDetails: {
      currentActivityId: string;
      currentActivityName: string;
      currentActivityDescription: string;
      currentActivityImage: string | null;
      totalActivities: number;
    },
  ) {
    const flowId = completedEntityDto.id;
    const flow = appletDetails.activityFlows.find(f => f.id === flowId);
    if (!flow) {
      this.logger.warn(
        `[ProgressSyncService.reconstructFlowState] Flow ${flowId} not found`,
      );
      return;
    }

    const activityFlowOrder =
      (completedEntityDto.activityFlowOrder as number) ?? 0;

    // Build the full activities array for the flow
    const activities = flow.activityIds
      .map(activityId => {
        const activity = appletDetails.activities.find(
          a => a.id === activityId,
        );
        if (!activity) {
          this.logger.warn(
            `[ProgressSyncService.reconstructFlowState] Activity ${activityId} not found`,
          );
          return null;
        }
        return activity;
      })
      .filter(a => a !== null);

    if (activities.length !== flow.activityIds.length) {
      this.logger.warn(
        `[ProgressSyncService.reconstructFlowState] Could not resolve all activities in flow`,
      );
      return;
    }

    // Build pipeline starting from activity 0
    const pipeline = buildActivityFlowPipeline({
      appletId: appletDetails.id,
      eventId: completedEntityDto.scheduledEventId,
      flowId,
      targetSubjectId: completedEntityDto.targetSubjectId,
      activities: activities as FlowProgressActivity[],
      startFrom: 0,
      hasSummary: () => false, // Summary info not available from server
    });

    // Calculate the step in the pipeline
    // Each activity has 2 pipeline items: Stepper + Intermediate (except last has Stepper + Summary + Finish)
    // For activityFlowOrder, the step is activityFlowOrder * 2 (pointing to the Stepper)
    const step = activityFlowOrder * 2;

    const flowState: FlowState = {
      step,
      flowName: flow.name,
      scheduledDate: null, // Not available from server
      pipeline,
      isCompletedDueToTimer: false,
      interruptionStep: null,
      context: {},
    };

    // Save to storage
    const key = getFlowRecordKey(
      flowId,
      appletDetails.id,
      completedEntityDto.scheduledEventId,
      completedEntityDto.targetSubjectId,
    );
    const storage = getDefaultStorageInstanceManager().getFlowProgressStorage();
    storage.set(key, JSON.stringify(flowState));
  }

  public async sync(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
  ): Promise<void> {
    try {
      await this.syncWithAppletDto(appletDto, appletCompletions);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(
        '[ProgressSyncService.sync]: Error occurred: \nInternal Error: \n\n' +
          errorMessage,
      );

      throw error;
    }
  }
}
