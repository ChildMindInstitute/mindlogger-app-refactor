import { AppletDetailsDto } from '@app/shared/api/services/IAppletService';
import {
  CompletedEntityDto,
  EntitiesCompletionsDto,
} from '@app/shared/api/services/IEventsService';
import { ILogger } from '@app/shared/lib/types/logger';
import { buildDateTimeFromDto } from '@app/shared/lib/utils/dateTime';
import { IAppletProgressSyncService } from '@entities/applet/model/services/IAppletProgressSyncService';

import { AppletDetails } from '../../lib/types';
import { mapAppletDetailsFromDto } from '../mappers';
import { appletActions, UpsertEntityProgressionPayload } from '../slice';

export class ProgressSyncService implements IAppletProgressSyncService {
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;

  constructor(state: RootState, dispatch: AppDispatch, logger: ILogger) {
    this.logger = logger;
    this.dispatch = dispatch;
    this.state = state;
  }

  private async syncWithAppletDto(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
  ) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);

    try {
      const { activities, activityFlows } = appletCompletions;

      [...activities, ...activityFlows].forEach(completionDto => {
        this.upsertEntityProgression(appletDetails, completionDto);
      });
    } catch (error) {
      throw new Error(
        '[ProgressSyncService.syncWithAppletDto]: Error occurred during sync progress entities:\n\n' +
          error,
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

    const payload: UpsertEntityProgressionPayload = {
      appletId: appletDetails.id,
      entityType: isFlow ? 'activityFlow' : 'activity',
      entityId: completedEntityDto.id,
      eventId: completedEntityDto.scheduledEventId,
      targetSubjectId: completedEntityDto.targetSubjectId,
      endAt: buildDateTimeFromDto(
        completedEntityDto.localEndDate as string,
        completedEntityDto.localEndTime as string,
      ),
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

        this.logger.log(
          `[ProgressSyncService.upsertEntityProgression]: In-progress flow detected - ${flowDetails.currentActivityName} (${payload.activityFlowOrder + 1}/${flowDetails.totalActivities})`,
        );
      } else {
        this.logger.warn(
          `[ProgressSyncService.upsertEntityProgression]: Skipping in-progress flow with invalid data`,
        );
        return;
      }
    }

    this.dispatch(appletActions.upsertEntityProgression(payload));
    this.logger.log(
      `[ProgressSyncService.upsertEntityProgression]: Upserted progression ${JSON.stringify(payload)}`,
    );
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

    // activityFlowOrder is 0-indexed, use directly
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

  public sync(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
  ) {
    try {
      return this.syncWithAppletDto(appletDto, appletCompletions);
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
