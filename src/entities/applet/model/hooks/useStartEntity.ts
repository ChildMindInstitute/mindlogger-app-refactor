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
  isEntityExpired,
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

type FailReason =
  | 'media-found'
  | 'migrations-not-applied'
  | 'all-items-hidden'
  | 'not-available'
  | 'mutex-busy'
  | 'expired-while-alert-opened';

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

  async function evaluateProgressDataWithAddingToQueue(
    appletId: string,
    entityId: string,
    eventId: string,
    entityType: EntityType,
  ): Promise<{ isEntityInProgress: boolean; availableTo: number | null }> {
    const progress = getEntityProgress(
      appletId,
      entityId,
      eventId,
      allProgresses,
    );

    let evaluatedIsInProgress = isInProgress(progress);

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
      evaluatedIsInProgress = false;
    }

    return {
      isEntityInProgress: evaluatedIsInProgress,
      availableTo: progress?.availableTo ?? null,
    };
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

    const { isEntityInProgress: isActivityInProgress, availableTo } =
      await evaluateProgressDataWithAddingToQueue(
        appletId,
        activityId,
        eventId,
        'regular',
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

      const logParams: LogActivityActionParams = {
        activityId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
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
            logRestartActivity(logParams);
            cleanUpMediaFiles({ activityId, appletId, eventId, order: 0 });
            activityStarted(appletId, activityId, eventId);
            resolve({ fromScratch: true });
          },
          onResume: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }
            logResumeActivity(logParams);
            return resolve({ fromScratch: false });
          },
        });
      } else {
        logStartActivity(logParams);
        activityStarted(appletId, activityId, eventId);
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
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      Logger.log('[useStartEntity.startActivity] Mutex is busy');

      return { failed: true, failReason: 'mutex-busy' };
    }

    try {
      mutex.setBusy();

      if (
        !(await checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: activityId,
          entityType: 'regular',
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
      );

      result.failed = !!result.failReason;

      Logger.log(
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

      const logParams: LogFlowActionParams = {
        flowId,
        appletId,
        appletName: getAppletDisplayName(appletId)!,
        entityName,
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
            resolve({ fromScratch: true });
          },
          onResume: () => {
            if (isEntityExpired(availableTo)) {
              return resolve({ failReason: 'expired-while-alert-opened' });
            }

            logResumeFlow(logParams);
            return resolve({ fromScratch: false });
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
  ): Promise<StartResult> {
    if (mutex.isBusy()) {
      Logger.log('[useStartEntity.startFlow] Mutex is busy');

      return { failed: true, failReason: 'mutex-busy' };
    }

    try {
      mutex.setBusy();

      if (
        !(await checkAvailability(entityName, {
          appletId,
          eventId,
          entityId: flowId,
          entityType: 'flow',
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
      );

      result.failed = !!result.failReason;

      Logger.log(
        `[useStartEntity.startFlow]: Result: ${JSON.stringify(result)}`,
      );

      return result;
    } finally {
      mutex.release();
    }
  }

  return { startActivity, startFlow };
}

export default useStartEntity;
