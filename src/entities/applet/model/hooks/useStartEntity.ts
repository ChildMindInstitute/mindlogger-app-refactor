import { useQueryClient } from '@tanstack/react-query';

import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityType,
  EvaluateAvailableTo,
  LookupEntityInput,
} from '@app/abstract/lib/types/entity';
import {
  EntityProgression,
  EntityProgressionInProgress,
} from '@app/abstract/lib/types/entityProgress';
import { ActivityRecordKeyParams } from '@app/abstract/lib/types/storage';
import { reduxStore } from '@app/app/ui/AppProvider/ReduxProvider';
import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsResponse,
} from '@app/shared/api/services/IAppletService';
import { isFlowResumeEnabled } from '@app/shared/lib/featureFlags/isFlowResumeEnabled';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { useAppletInfo } from '@app/shared/lib/hooks/useAppletInfo';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { MigrationValidator } from '@app/shared/lib/services/MigrationValidator';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';
import {
  getDataFromQuery,
  getAppletDetailsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';
import {
  getEntityProgression,
  isEntityProgressionInProgress,
  isProgressionReadyForAutocompletion,
  isEntityExpired,
} from '@app/shared/lib/utils/survey/survey';
import {
  clearActivityStorageRecord,
  getFlowRecordKey,
} from '@app/widgets/survey/lib/storageHelpers';
import {
  TrackActivityActionParams,
  TrackFlowActionParams,
  trackRestartActivity,
  trackRestartFlow,
  trackResumeActivity,
  trackResumeFlow,
  trackStartActivity,
  trackStartFlow,
} from '@app/widgets/survey/lib/surveyStateAnalytics';
import { FlowState } from '@app/widgets/survey/lib/useFlowStorageRecord';

import {
  onActivityContainsAllItemsHidden,
  onBeforeStartingActivity,
  onFlowActivityContainsAllItemsHidden,
  onMediaReferencesFound,
  onMigrationsNotApplied,
} from '../../lib/alerts';
import { selectAppletsEntityProgressions } from '../selectors';
import { TargetedProgressSyncService } from '../services/TargetedProgressSyncService';
import { appletActions } from '../slice';

type FailReason =
  | 'media-found'
  | 'migrations-not-applied'
  | 'all-items-hidden'
  | 'not-available'
  | 'mutex-busy'
  | 'expired-while-alert-opened'
  | 'completed-elsewhere';

type StartResult = {
  fromScratch?: boolean;
  failReason?: FailReason;
  failed?: boolean;
};

type UseStartEntityInput = {
  hasMediaReferences: (input: LookupEntityInput) => boolean;
  hasActivityWithHiddenAllItems: (input: LookupEntityInput) => boolean;
  cleanUpMediaFiles: (keyParams: ActivityRecordKeyParams) => void;
  evaluateAvailableTo: EvaluateAvailableTo;
  completeEntityIntoUploadToQueue: CompleteEntityIntoUploadToQueue;
  checkAvailability: CheckAvailability;
};

type FlowStartedArgs = {
  appletId: string;
  flowId: string;
  eventId: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  activityImage: string | null;
  pipelineActivityOrder: number;
  totalActivities: number;
  targetSubjectId: string | null;
};

export function useStartEntity({
  hasMediaReferences,
  hasActivityWithHiddenAllItems,
  cleanUpMediaFiles,
  evaluateAvailableTo,
  completeEntityIntoUploadToQueue,
  checkAvailability,
}: UseStartEntityInput) {
  const mutex = getMutexDefaultInstanceManager().getStartEntityMutex();

  const dispatch = useAppDispatch();

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  const queryClient = useQueryClient();

  const { getName: getAppletDisplayName } = useAppletInfo();

  const logger: ILogger = getDefaultLogger();

  // Syncs progress for a single applet using targeted sync if the feature flag is enabled
  async function syncAppletProgress(appletId: string): Promise<void> {
    if (!isFlowResumeEnabled(appletId)) {
      logger.log(
        `[useStartEntity.syncAppletProgress] Flag disabled for ${appletId}, skipping sync (original behavior)`,
      );
      return;
    }

    logger.log(
      `[useStartEntity.syncAppletProgress] Using targeted sync for ${appletId}`,
    );
    const syncService = new TargetedProgressSyncService(
      reduxStore.getState(),
      dispatch,
      logger,
      queryClient,
    );
    await syncService.syncAppletProgress(appletId);
  }

  function activityStart(
    appletId: string,
    activityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ) {
    const availableTo = evaluateAvailableTo(appletId, eventId);

    dispatch(
      appletActions.startActivity({
        appletId,
        entityId: activityId,
        eventId,
        availableUntil: availableTo,
        targetSubjectId,
      }),
    );
  }

  function flowStarted({
    appletId,
    flowId,
    eventId,
    activityId,
    activityName,
    activityDescription,
    activityImage,
    totalActivities,
    pipelineActivityOrder,
    targetSubjectId,
  }: FlowStartedArgs) {
    const availableTo = evaluateAvailableTo(appletId, eventId);

    dispatch(
      appletActions.startFlow({
        appletId,
        flowId,
        eventId,
        targetSubjectId,
        activityId,
        activityName,
        activityDescription,
        activityImage,
        pipelineActivityOrder,
        totalActivities,
        availableTo,
      }),
    );
  }

  const shouldBreakDueToMediaReferences = async (
    appletId: string,
    entityId: string,
    entityType: EntityType,
  ): Promise<boolean> => {
    const isOnline = await isAppOnline();

    return (
      !isOnline &&
      hasMediaReferences({
        appletId,
        entityId: entityId,
        entityType,
        queryClient,
      })
    );
  };

  const shouldBreakDueToAllItemsHidden = (
    appletId: string,
    entityId: string,
    entityType: EntityType,
  ): boolean => {
    return hasActivityWithHiddenAllItems({
      appletId,
      entityId,
      entityType: entityType,
      queryClient,
    });
  };

  async function evaluateProgressDataWithAddingToQueue(
    appletId: string,
    entityId: string,
    eventId: string,
    entityType: EntityType,
    targetSubjectId: string | null,
  ): Promise<{ isEntityInProgress: boolean; availableTo: number | null }> {
    const freshProgressions: EntityProgression[] =
      selectAppletsEntityProgressions(reduxStore.getState());

    const progression = getEntityProgression(
      appletId,
      entityId,
      eventId,
      targetSubjectId,
      freshProgressions,
    );

    let evaluatedIsInProgress = isEntityProgressionInProgress(progression);

    const entityPath: EntityPath = {
      appletId,
      entityId,
      eventId,
      entityType,
      targetSubjectId,
    };

    const readyForAutocompletion = isProgressionReadyForAutocompletion(
      entityPath,
      freshProgressions,
    );

    if (readyForAutocompletion) {
      await completeEntityIntoUploadToQueue(entityPath);
      evaluatedIsInProgress = false;
    }

    return {
      isEntityInProgress: evaluatedIsInProgress,
      availableTo:
        (progression as EntityProgressionInProgress | null)
          ?.availableUntilTimestamp || null,
    };
  }

  async function startActivityInternal(
    appletId: string,
    activityId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
    targetSubjectId: string | null,
    itemTypes: ResponseType[],
  ): Promise<StartResult> {
    const breakDueToMediaReferences = await shouldBreakDueToMediaReferences(
      appletId,
      activityId,
      'regular',
    );

    const { isEntityInProgress: isActivityInProgress, availableTo } =
      await evaluateProgressDataWithAddingToQueue(
        appletId,
        activityId,
        eventId,
        'regular',
        targetSubjectId,
      );

    return new Promise<StartResult>(resolve => {
      if (!MigrationValidator.allMigrationHaveBeenApplied()) {
        onMigrationsNotApplied();
        resolve({ failReason: 'migrations-not-applied' });
        return;
      }

      if (breakDueToMediaReferences) {
        onMediaReferencesFound();
        resolve({ failReason: 'media-found' });
        return;
      }

      if (shouldBreakDueToAllItemsHidden(appletId, activityId, 'regular')) {
        onActivityContainsAllItemsHidden(entityName);
        resolve({ failReason: 'all-items-hidden' });
        return;
      }

      logger.cancelSending();

      const logParams: TrackActivityActionParams = {
        activityId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
        itemTypes,
      };

      if (isActivityInProgress) {
        if (isTimerElapsed) {
          resolve({ fromScratch: false });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }
            trackRestartActivity(logParams);
            cleanUpMediaFiles({
              activityId,
              appletId,
              eventId,
              targetSubjectId,
              order: 0,
            });
            activityStart(appletId, activityId, eventId, targetSubjectId);
            resolve({ fromScratch: true });
          },
          onResume: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }
            trackResumeActivity(logParams);
            return resolve({ fromScratch: false });
          },
        });
      } else {
        trackStartActivity(logParams);

        // Safety net: clear any stale activity record before fresh start
        // This prevents old answers from leaking into a new session
        // Matches web useStartSurvey safety net from eac9f0c0.
        clearActivityStorageRecord(
          appletId,
          activityId,
          eventId,
          targetSubjectId,
          0,
        );

        activityStart(appletId, activityId, eventId, targetSubjectId);
        resolve({ fromScratch: true });
      }
    });
  }

  async function startActivity(
    appletId: string,
    activityId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
    targetSubjectId: string | null,
    itemTypes: ResponseType[],
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      getDefaultLogger().log('[useStartEntity.startActivity] Mutex is busy');

      return { failed: true, failReason: 'mutex-busy' };
    }

    try {
      mutex.setBusy();

      await syncAppletProgress(appletId);

      if (
        !(await checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: activityId,
          entityType: 'regular',
          targetSubjectId,
        }))
      ) {
        return { failed: true, failReason: 'not-available' };
      }

      const result = await startActivityInternal(
        appletId,
        activityId,
        eventId,
        entityName,
        isTimerElapsed,
        targetSubjectId,
        itemTypes,
      );

      result.failed = !!result.failReason;

      getDefaultLogger().log(
        `[useStartEntity.startActivity]: Result: ${JSON.stringify(result)}`,
      );

      return result;
    } finally {
      mutex.release();
    }
  }

  async function startFlowInternal(
    appletId: string,
    flowId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean = false,
    targetSubjectId: string | null,
    itemTypes: ResponseType[],
  ): Promise<StartResult> {
    const detailsResponse: AppletDetailsResponse =
      getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(appletId),
        queryClient,
      )!;

    const getFlowActivities = (): string[] => {
      const activityFlowDtos: ActivityFlowRecordDto[] =
        detailsResponse.result.activityFlows;
      const flow = activityFlowDtos.find(x => x.id === flowId)!;

      return flow.activityIds;
    };

    const getActivity = (id: string): ActivityRecordDto => {
      return detailsResponse.result.activities.find(x => x.id === id)!;
    };

    const flowActivities: string[] = getFlowActivities();

    const firstActivityId: string = flowActivities[0];

    const firstActivity = getActivity(firstActivityId);

    const totalActivities = flowActivities.length;

    const breakDueToMediaReferences = await shouldBreakDueToMediaReferences(
      appletId,
      flowId,
      'flow',
    );

    const { isEntityInProgress: isFlowInProgress, availableTo } =
      await evaluateProgressDataWithAddingToQueue(
        appletId,
        flowId,
        eventId,
        'flow',
        targetSubjectId,
      );

    return new Promise<StartResult>(resolve => {
      if (!MigrationValidator.allMigrationHaveBeenApplied()) {
        onMigrationsNotApplied();
        resolve({ failReason: 'migrations-not-applied' });
        return;
      }

      if (breakDueToMediaReferences) {
        onMediaReferencesFound();
        resolve({ failReason: 'media-found' });
        return;
      }

      if (shouldBreakDueToAllItemsHidden(appletId, flowId, 'flow')) {
        onFlowActivityContainsAllItemsHidden(entityName);
        resolve({ failReason: 'all-items-hidden' });
        return;
      }

      logger.cancelSending();

      const logParams: Omit<TrackFlowActionParams, 'activityId'> = {
        flowId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
        itemTypes,
      };

      if (isFlowInProgress) {
        if (isTimerElapsed) {
          resolve({ fromScratch: false });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }

            // Clear FlowState to ensure clean restart
            const flowStateKey = getFlowRecordKey(
              flowId,
              appletId,
              eventId,
              targetSubjectId,
            );
            const flowStorage =
              getDefaultStorageInstanceManager().getFlowProgressStorage();
            flowStorage.delete(flowStateKey);

            logger.log(`[useStartEntity.onRestart] Cleared FlowState`);

            for (let i = 0; i < flowActivities.length; i++) {
              // TODO: it should be based on progress record
              cleanUpMediaFiles({
                activityId: flowActivities[i],
                appletId,
                eventId,
                targetSubjectId,
                order: i,
              });
            }
            trackRestartFlow({
              ...logParams,
              activityId: firstActivityId,
            });

            flowStarted({
              appletId,
              flowId,
              targetSubjectId,
              activityId: firstActivity.id,
              activityDescription: firstActivity.description,
              activityImage: firstActivity.image,
              eventId,
              pipelineActivityOrder: 0,
              activityName: firstActivity.name,
              totalActivities,
            });
            resolve({ fromScratch: true });
          },
          onResume: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }

            const key = getFlowRecordKey(
              flowId,
              appletId,
              eventId,
              targetSubjectId,
            );
            const storage =
              getDefaultStorageInstanceManager().getFlowProgressStorage();

            let flowState: FlowState | undefined;
            try {
              const storedValue = storage.getString(key);
              if (storedValue) {
                flowState = JSON.parse(storedValue) as FlowState;
              }
            } catch (error) {
              logger.error(
                `[useStartEntity.onResume] Failed to parse flow state: ${error}`,
              );
            }

            if (
              !flowState ||
              !flowState.pipeline ||
              flowState.pipeline.length === 0
            ) {
              logger.warn(
                '[useStartEntity.onResume] No valid flow state found, starting from scratch',
              );
              return resolve({ fromScratch: true });
            }

            trackResumeFlow({
              ...logParams,
              activityId: flowState.pipeline[flowState.step].payload.activityId,
            });

            return resolve({ fromScratch: false });
          },
        });
      } else {
        trackStartFlow({
          ...logParams,
          activityId: firstActivityId,
        });

        // Safety net: clear any stale activity record for the first activity before fresh start
        // This prevents old answers from leaking into a new flow session
        // Matches web useStartSurvey safety net from eac9f0c0.
        clearActivityStorageRecord(
          appletId,
          firstActivityId,
          eventId,
          targetSubjectId,
          0,
        );

        flowStarted({
          appletId,
          flowId,
          eventId,
          targetSubjectId,
          activityId: firstActivity.id,
          activityName: firstActivity.name,
          activityDescription: firstActivity.description,
          activityImage: firstActivity.image,
          pipelineActivityOrder: 0,
          totalActivities,
        });

        resolve({ fromScratch: true });
      }
    });
  }

  async function startFlow(
    appletId: string,
    flowId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
    targetSubjectId: string | null,
    itemTypes: ResponseType[],
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      getDefaultLogger().log('[useStartEntity.startFlow] Mutex is busy');

      return { failed: true, failReason: 'mutex-busy' };
    }

    try {
      mutex.setBusy();

      const isCrossDeviceSyncEnabled = isFlowResumeEnabled(appletId);

      // Only perform cross-device completion detection when feature flag is enabled
      let wasInProgress = false;
      let preRefreshSubmitId: string | null = null;

      if (isCrossDeviceSyncEnabled) {
        // Capture pre-refresh state to detect cross-device completion
        const preRefreshProgressions: EntityProgression[] =
          selectAppletsEntityProgressions(reduxStore.getState());
        const preRefreshProgression = getEntityProgression(
          appletId,
          flowId,
          eventId,
          targetSubjectId,
          preRefreshProgressions,
        );
        wasInProgress = isEntityProgressionInProgress(preRefreshProgression);
        preRefreshSubmitId = wasInProgress
          ? (preRefreshProgression as EntityProgressionInProgress).submitId
          : null;
      }

      await syncAppletProgress(appletId);

      // Check if the flow we started was completed on another device
      // Only when feature flag is enabled
      if (isCrossDeviceSyncEnabled && wasInProgress && preRefreshSubmitId) {
        const postRefreshProgressions: EntityProgression[] =
          selectAppletsEntityProgressions(reduxStore.getState());
        const postRefreshProgression = getEntityProgression(
          appletId,
          flowId,
          eventId,
          targetSubjectId,
          postRefreshProgressions,
        );

        const isNowCompleted = postRefreshProgression?.status === 'completed';
        const submitIdsMatch =
          postRefreshProgression?.submitId === preRefreshSubmitId;

        // SAME submitId completed elsewhere - show alert and block
        if (isNowCompleted && submitIdsMatch) {
          return { failed: true, failReason: 'completed-elsewhere' };
        }
      }

      if (
        !(await checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: flowId,
          entityType: 'flow',
          targetSubjectId,
        }))
      ) {
        return { failed: true, failReason: 'not-available' };
      }

      const result = await startFlowInternal(
        appletId,
        flowId,
        eventId,
        entityName,
        isTimerElapsed,
        targetSubjectId,
        itemTypes,
      );

      result.failed = !!result.failReason;

      getDefaultLogger().log(
        `[useStartEntity.startFlow]: Result: ${JSON.stringify(result)}`,
      );

      return result;
    } finally {
      mutex.release();
    }
  }

  return { startActivity, startFlow };
}
