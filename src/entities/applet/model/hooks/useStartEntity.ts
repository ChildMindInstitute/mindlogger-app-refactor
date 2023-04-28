import { useQueryClient } from '@tanstack/react-query';

import { FlowProgress, StoreProgressPayload } from '@app/abstract/lib';
import { ActivityFlowRecordDto, AppletDetailsResponse } from '@app/shared/api';
import {
  getAppletDetailsKey,
  getDataFromQuery,
  useAppDispatch,
  useAppSelector,
} from '@shared/lib';

import { onBeforeStartingActivity } from '../../lib';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

function useStartEntity() {
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

  function startActivity(
    appletId: string,
    activityId: string,
    eventId: string,
  ) {
    return new Promise<boolean>(resolve => {
      const progressRecord = getProgress(appletId, activityId, eventId);

      if (isInProgress(progressRecord)) {
        onBeforeStartingActivity({
          onRestart: () => {
            activityStarted(appletId, activityId, eventId);
            resolve(true);
          },
          onResume: () => resolve(false),
        });
      } else {
        activityStarted(appletId, activityId, eventId);
        resolve(false);
      }
    });
  }

  function startFlow(appletId: string, flowId: string, eventId: string) {
    const detailsResponse: AppletDetailsResponse =
      getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(appletId),
        queryClient,
      )!;

    const activityFlowDtos: ActivityFlowRecordDto[] =
      detailsResponse.result.activityFlows;

    const flow = activityFlowDtos!.find(x => x.id === flowId);
    const firstActivityId = flow!.activityIds[0];

    const progressRecord = getProgress(
      appletId,
      flowId,
      eventId,
    ) as FlowProgress;

    const resumeActivityId = progressRecord?.currentActivityId;

    return new Promise<{
      startedFromActivity: string;
      startedFromScratch: boolean;
    }>(resolve => {
      if (isInProgress(progressRecord as StoreProgressPayload)) {
        onBeforeStartingActivity({
          onRestart: () => {
            flowStarted(appletId, flowId, firstActivityId, eventId, 0);
            resolve({
              startedFromActivity: firstActivityId,
              startedFromScratch: true,
            });
          },
          onResume: () =>
            resolve({
              startedFromActivity: resumeActivityId,
              startedFromScratch: false,
            }),
        });
      } else {
        flowStarted(appletId, flowId, firstActivityId, eventId, 0);
        resolve({
          startedFromActivity: firstActivityId,
          startedFromScratch: true,
        });
      }
    });
  }

  return { startActivity, startFlow };
}

export default useStartEntity;
