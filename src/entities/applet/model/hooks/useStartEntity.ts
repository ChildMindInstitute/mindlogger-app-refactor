import { useQueryClient } from '@tanstack/react-query';

import {
  ActivityRecordKeyParams,
  LookupMediaInput,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { ActivityFlowRecordDto, AppletDetailsResponse } from '@app/shared/api';
import {
  Logger,
  getAppletDetailsKey,
  getDataFromQuery,
  isAppOnline,
  useAppDispatch,
  useAppSelector,
} from '@shared/lib';

import { onBeforeStartingActivity, onMediaReferencesFound } from '../../lib';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

type StartResult = {
  startedFromScratch?: boolean;
  cannotBeStartedDueToMediaFound?: boolean;
};

type UseStartEntityInput = {
  hasMediaReferences: (input: LookupMediaInput) => boolean;
  cleanUpMediaFiles: (keyParams: ActivityRecordKeyParams) => void;
};

function useStartEntity({
  hasMediaReferences,
  cleanUpMediaFiles,
}: UseStartEntityInput) {
  const dispatch = useAppDispatch();

  const allProgresses = useAppSelector(selectInProgressApplets);

  const queryClient = useQueryClient();

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

    return new Promise<StartResult>(resolve => {
      if (shouldBreakDueToMediaReferences()) {
        onMediaReferencesFound();
        resolve({ cannotBeStartedDueToMediaFound: true });
        return;
      }

      Logger.cancelSending('Start activity');

      const isActivityInProgress = isInProgress(
        getProgress(appletId, activityId, eventId),
      );

      if (isActivityInProgress) {
        if (isTimerElapsed) {
          resolve({ startedFromScratch: false });
          return;
        }

        onBeforeStartingActivity({
          onRestart: () => {
            cleanUpMediaFiles({ activityId, appletId, eventId, order: 0 });

            activityStarted(appletId, activityId, eventId);
            resolve({ startedFromScratch: true });
          },
          onResume: () => resolve({ startedFromScratch: false }),
        });
      } else {
        activityStarted(appletId, activityId, eventId);
        resolve({ startedFromScratch: true });
      }
    });
  }

  async function startFlow(
    appletId: string,
    flowId: string,
    eventId: string,
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

      Logger.cancelSending('Start flow');

      const isFlowInProgress = isInProgress(
        getProgress(appletId, flowId, eventId),
      );

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

            flowStarted(appletId, flowId, firstActivityId, eventId, 0);
            resolve({
              startedFromScratch: true,
            });
          },
          onResume: () =>
            resolve({
              startedFromScratch: false,
            }),
        });
      } else {
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
