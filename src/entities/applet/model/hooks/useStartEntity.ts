import { useQueryClient } from '@tanstack/react-query';

import {
  ActivityRecordKeyParams,
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityType,
  EvaluateAvailableTo,
  LookupEntityInput,
  StoreProgressPayload,
} from '@app/abstract/lib';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsResponse,
} from '@app/shared/api';
import {
  getAppletDetailsKey,
  getDataFromQuery,
  getEntityProgress,
  ILogger,
  isAppOnline,
  isEntityInProgress,
  isReadyForAutocompletion,
  Logger,
  MigrationValidator,
  Mutex,
  useAppDispatch,
  useAppletInfo,
  useAppSelector,
} from '@shared/lib';

import {
  LogActivityActionParams,
  LogFlowActionParams,
  logRestartActivity,
  logRestartFlow,
  logResumeActivity,
  logResumeFlow,
  logStartActivity,
  logStartFlow,
} from './startEntityHelpers';
import {
  onActivityContainsAllItemsHidden,
  onFlowActivityContainsAllItemsHidden,
  onBeforeStartingActivity,
  onMediaReferencesFound,
  onMigrationsNotApplied,
} from '../../lib';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

type StartResult = {
  startedFromScratch?: boolean;
  cannotBeStartedDueToMediaFound?: boolean;
  cannotBeStartedDueToMigrationsNotApplied?: boolean;
  cannotBeStartedDueToAllItemsHidden?: boolean;
  cannotBeStarted?: boolean;
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
};

export const StartEntityMutex = Mutex();

function useStartEntity({
  hasMediaReferences,
  hasActivityWithHiddenAllItems,
  cleanUpMediaFiles,
  evaluateAvailableTo,
  completeEntityIntoUploadToQueue,
  checkAvailability,
}: UseStartEntityInput) {
  const mutex = StartEntityMutex;

  const dispatch = useAppDispatch();

  const allProgresses = useAppSelector(selectInProgressApplets);

  const queryClient = useQueryClient();

  const { getName: getAppletDisplayName } = useAppletInfo();

  const logger: ILogger = Logger;

  const isInProgress = (payload: StoreProgressPayload | undefined): boolean =>
    isEntityInProgress(payload);

  function activityStarted(
    appletId: string,
    activityId: string,
    eventId: string,
  ) {
    const availableTo = evaluateAvailableTo(appletId, eventId);

    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
        availableTo,
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
  }: FlowStartedArgs) {
    const availableTo = evaluateAvailableTo(appletId, eventId);

    dispatch(
      actions.flowStarted({
        appletId,
        flowId,
        eventId,
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

  async function evaluateProgressWithAutocompletion(
    appletId: string,
    entityId: string,
    eventId: string,
    entityType: EntityType,
  ): Promise<boolean> {
    const progress = getEntityProgress(
      appletId,
      entityId,
      eventId,
      allProgresses,
    );

    let isActivityInProgress = isInProgress(progress);

    const entityPath: EntityPath = {
      appletId,
      entityId,
      eventId,
      entityType,
    };

    const readyForAutocompletion = isReadyForAutocompletion(
      entityPath,
      allProgresses,
    );

    if (readyForAutocompletion) {
      await completeEntityIntoUploadToQueue(entityPath);
      isActivityInProgress = false;
    }

    return isActivityInProgress;
  }

  async function startActivityInternal(
    appletId: string,
    activityId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
  ): Promise<StartResult> {
    const breakDueToMediaReferences = await shouldBreakDueToMediaReferences(
      appletId,
      activityId,
      'regular',
    );

    let isActivityInProgress = await evaluateProgressWithAutocompletion(
      appletId,
      activityId,
      eventId,
      'regular',
    );

    return new Promise<StartResult>(async resolve => {
      if (!MigrationValidator.allMigrationHaveBeenApplied()) {
        onMigrationsNotApplied();
        resolve({
          cannotBeStartedDueToMigrationsNotApplied: true,
        });
        return;
      }

      if (breakDueToMediaReferences) {
        onMediaReferencesFound();
        resolve({
          cannotBeStartedDueToMediaFound: true,
        });
        return;
      }

      if (shouldBreakDueToAllItemsHidden(appletId, activityId, 'regular')) {
        onActivityContainsAllItemsHidden(entityName);
        resolve({
          cannotBeStartedDueToAllItemsHidden: true,
        });
        return;
      }

      logger.cancelSending();

      const logParams: LogActivityActionParams = {
        activityId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
      };

      if (isActivityInProgress) {
        if (isTimerElapsed) {
          resolve({ startedFromScratch: false });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            logRestartActivity(logParams);
            cleanUpMediaFiles({ activityId, appletId, eventId, order: 0 });
            activityStarted(appletId, activityId, eventId);
            resolve({ startedFromScratch: true });
          },
          onResume: () => {
            logResumeActivity(logParams);
            return resolve({ startedFromScratch: false });
          },
        });
      } else {
        logStartActivity(logParams);
        activityStarted(appletId, activityId, eventId);
        resolve({ startedFromScratch: true });
      }
    });
  }

  async function startActivity(
    appletId: string,
    activityId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      Logger.log('[useStartEntity.startActivity] Mutex is busy');
      return {
        cannotBeStarted: true,
      };
    }

    try {
      mutex.setBusy();

      if (
        !checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: activityId,
          entityType: 'regular',
        })
      ) {
        return {
          cannotBeStarted: true,
        };
      }

      return await startActivityInternal(
        appletId,
        activityId,
        eventId,
        entityName,
        isTimerElapsed,
      );
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
  ): Promise<StartResult> {
    const detailsResponse: AppletDetailsResponse =
      getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(appletId),
        queryClient,
      )!;

    const getFlowActivities = (): string[] => {
      const activityFlowDtos: ActivityFlowRecordDto[] =
        detailsResponse.result.activityFlows;
      const flow = activityFlowDtos!.find(x => x.id === flowId)!;

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

    let isFlowInProgress = await evaluateProgressWithAutocompletion(
      appletId,
      flowId,
      eventId,
      'flow',
    );

    return new Promise<StartResult>(resolve => {
      if (!MigrationValidator.allMigrationHaveBeenApplied()) {
        onMigrationsNotApplied();
        resolve({
          cannotBeStartedDueToMigrationsNotApplied: true,
        });
        return;
      }

      if (breakDueToMediaReferences) {
        onMediaReferencesFound();
        resolve({ cannotBeStartedDueToMediaFound: true });
        return;
      }

      if (shouldBreakDueToAllItemsHidden(appletId, flowId, 'flow')) {
        onFlowActivityContainsAllItemsHidden(entityName);
        resolve({
          cannotBeStartedDueToAllItemsHidden: true,
        });
        return;
      }

      logger.cancelSending();

      const logParams: LogFlowActionParams = {
        flowId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
      };

      if (isFlowInProgress) {
        if (isTimerElapsed) {
          resolve({
            startedFromScratch: false,
          });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            for (let i = 0; i < flowActivities.length; i++) {
              // TODO: it should be based on progress record
              cleanUpMediaFiles({
                activityId: flowActivities[i],
                appletId,
                eventId,
                order: i,
              });
            }
            logRestartFlow(logParams);

            flowStarted({
              appletId,
              flowId,
              activityId: firstActivity.id,
              activityDescription: firstActivity.description,
              activityImage: firstActivity.image,
              eventId,
              pipelineActivityOrder: 0,
              activityName: firstActivity.name,
              totalActivities,
            });
            resolve({
              startedFromScratch: true,
            });
          },
          onResume: () => {
            logResumeFlow(logParams);
            return resolve({
              startedFromScratch: false,
            });
          },
        });
      } else {
        logStartFlow(logParams);
        flowStarted({
          appletId,
          flowId,
          eventId,
          activityId: firstActivity.id,
          activityName: firstActivity.name,
          activityDescription: firstActivity.description,
          activityImage: firstActivity.image,
          pipelineActivityOrder: 0,
          totalActivities,
        });

        resolve({
          startedFromScratch: true,
        });
      }
    });
  }

  async function startFlow(
    appletId: string,
    flowId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean,
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      Logger.log('[useStartEntity.startFlow] Mutex is busy');
      return Promise.resolve({
        cannotBeStarted: true,
      });
    }

    try {
      mutex.setBusy();

      if (
        !checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: flowId,
          entityType: 'flow',
        })
      ) {
        return {
          cannotBeStarted: true,
        };
      }

      return await startFlowInternal(
        appletId,
        flowId,
        eventId,
        entityName,
        isTimerElapsed,
      );
    } finally {
      mutex.release();
    }
  }

  return { startActivity, startFlow };
}

export default useStartEntity;
