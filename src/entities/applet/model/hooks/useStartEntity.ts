import { useQueryClient } from '@tanstack/react-query';

import {
  ActivityRecordKeyParams,
  LookupEntityInput,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { ActivityFlowRecordDto, AppletDetailsResponse } from '@app/shared/api';
import {
  getAppletDetailsKey,
  getDataFromQuery,
  ILogger,
  isAppOnline,
  Logger,
  useAppDispatch,
  useAppletInfo,
  useAppSelector,
} from '@shared/lib';

import {
  onActivityContainsAllItemsHidden,
  onFlowActivityContainsAllItemsHidden,
  onBeforeStartingActivity,
  onMediaReferencesFound,
} from '../../lib';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

type StartResult = {
  startedFromScratch?: boolean;
  cannotBeStartedDueToMediaFound?: boolean;
  cannotBeStartedDueToAllItemsHidden?: boolean;
};

type UseStartEntityInput = {
  hasMediaReferences: (input: LookupEntityInput) => boolean;
  hasActivityWithHiddenAllItems: (input: LookupEntityInput) => boolean;
  cleanUpMediaFiles: (keyParams: ActivityRecordKeyParams) => void;
};

function useStartEntity({
  hasMediaReferences,
  hasActivityWithHiddenAllItems,
  cleanUpMediaFiles,
}: UseStartEntityInput) {
  const dispatch = useAppDispatch();

  const allProgresses = useAppSelector(selectInProgressApplets);

  const queryClient = useQueryClient();

  const { getName: getAppletDisplayName } = useAppletInfo();

  const logger: ILogger = Logger;

  const getProgress = (
    appletId: string,
    entityId: string,
    eventId: string,
  ): StoreProgressPayload => allProgresses[appletId]?.[entityId]?.[eventId];

  const isInProgress = (payload: StoreProgressPayload): boolean =>
    payload && !payload.endAt;

  function activityStarted(
    appletId: string,
    activityId: string,
    eventId: string,
  ) {
    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
      }),
    );
  }

  function flowStarted(
    appletId: string,
    flowId: string,
    activityId: string,
    eventId: string,
    pipelineActivityOrder: number,
  ) {
    dispatch(
      actions.flowStarted({
        appletId,
        flowId,
        activityId,
        eventId,
        pipelineActivityOrder,
      }),
    );
  }

  async function startActivity(
    appletId: string,
    activityId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean = false,
  ): Promise<StartResult> {
    const isOnline = await isAppOnline();

    const shouldBreakDueToMediaReferences = (): boolean => {
      return (
        !isOnline &&
        hasMediaReferences({
          appletId,
          entityId: activityId,
          entityType: 'regular',
          queryClient,
        })
      );
    };

    const shouldBreakDueToAllItemsHidden = (): boolean => {
      return hasActivityWithHiddenAllItems({
        appletId,
        entityId: activityId,
        entityType: 'regular',
        queryClient,
      });
    };

    return new Promise<StartResult>(resolve => {
      if (shouldBreakDueToMediaReferences()) {
        onMediaReferencesFound();
        resolve({
          cannotBeStartedDueToMediaFound: true,
        });
        return;
      }

      if (shouldBreakDueToAllItemsHidden()) {
        onActivityContainsAllItemsHidden(entityName);
        resolve({
          cannotBeStartedDueToAllItemsHidden: true,
        });
        return;
      }

      logger.cancelSending('Start activity');

      const isActivityInProgress = isInProgress(
        getProgress(appletId, activityId, eventId),
      );

      const appletName = getAppletDisplayName(appletId);

      if (isActivityInProgress) {
        if (isTimerElapsed) {
          resolve({ startedFromScratch: false });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            cleanUpMediaFiles({ activityId, appletId, eventId, order: 0 });

            logger.log(
              `[useStartEntity.startActivity]: Activity "${entityName}|${activityId}" restarted, applet "${appletName}|${appletId}"`,
            );
            activityStarted(appletId, activityId, eventId);
            resolve({ startedFromScratch: true });
          },
          onResume: () => {
            logger.log(
              `[useStartEntity.startActivity]: Activity "${entityName}|${activityId}" resumed, applet "${appletName}|${appletId}"`,
            );
            return resolve({ startedFromScratch: false });
          },
        });
      } else {
        logger.log(
          `[useStartEntity.startActivity]: Activity "${entityName}|${activityId}" started, applet "${appletName}|${appletId}"`,
        );
        activityStarted(appletId, activityId, eventId);
        resolve({ startedFromScratch: true });
      }
    });
  }

  async function startFlow(
    appletId: string,
    flowId: string,
    eventId: string,
    entityName: string,
    isTimerElapsed: boolean = false,
  ): Promise<StartResult> {
    const isOnline = await isAppOnline();

    const shouldBreakDueToMediaReferences = (): boolean => {
      return (
        !isOnline &&
        hasMediaReferences({
          appletId,
          entityId: flowId,
          entityType: 'flow',
          queryClient,
        })
      );
    };

    const shouldBreakDueToAllItemsHidden = (): boolean => {
      return hasActivityWithHiddenAllItems({
        appletId,
        entityId: flowId,
        entityType: 'flow',
        queryClient,
      });
    };

    const getFlowActivities = (): string[] => {
      const detailsResponse: AppletDetailsResponse =
        getDataFromQuery<AppletDetailsResponse>(
          getAppletDetailsKey(appletId),
          queryClient,
        )!;

      const activityFlowDtos: ActivityFlowRecordDto[] =
        detailsResponse.result.activityFlows;
      const flow = activityFlowDtos!.find(x => x.id === flowId)!;

      return flow.activityIds;
    };

    const flowActivities: string[] = getFlowActivities();

    const firstActivityId: string = flowActivities[0];

    return new Promise<StartResult>(resolve => {
      if (shouldBreakDueToMediaReferences()) {
        onMediaReferencesFound();
        resolve({ cannotBeStartedDueToMediaFound: true });
        return;
      }

      if (shouldBreakDueToAllItemsHidden()) {
        onFlowActivityContainsAllItemsHidden(entityName);
        resolve({
          cannotBeStartedDueToAllItemsHidden: true,
        });
        return;
      }

      logger.cancelSending('Start flow');

      const isFlowInProgress = isInProgress(
        getProgress(appletId, flowId, eventId),
      );

      const appletName = getAppletDisplayName(appletId);

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
              cleanUpMediaFiles({
                activityId: flowActivities[i],
                appletId,
                eventId,
                order: i,
              });
            }
            logger.log(
              `[useStartEntity.startFlow]: Flow "${entityName}|${flowId}" restarted, applet "${appletName}|${appletId}"`,
            );

            flowStarted(appletId, flowId, firstActivityId, eventId, 0);
            resolve({
              startedFromScratch: true,
            });
          },
          onResume: () => {
            logger.log(
              `[useStartEntity.startFlow]: Flow "${entityName}|${flowId}" resumed, applet "${appletName}|${appletId}"`,
            );

            return resolve({
              startedFromScratch: false,
            });
          },
        });
      } else {
        logger.log(
          `[useStartEntity.startFlow]: Flow "${entityName}|${flowId}" started, applet "${appletName}|${appletId}"`,
        );

        flowStarted(appletId, flowId, firstActivityId, eventId, 0);
        resolve({
          startedFromScratch: true,
        });
      }
    });
  }

  return { startActivity, startFlow };
}

export default useStartEntity;
