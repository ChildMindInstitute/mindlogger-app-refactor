import { StoreProgressPayload } from '@app/abstract/lib';
import { useAppDispatch, useAppSelector } from '@shared/lib';

import { useAppletDetailsQuery } from '../../api';
import { onBeforeStartingActivity } from '../../lib';
import { mapActivityFlowsFromDto } from '../mappers';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

function useInProgressEntities(appletId: string) {
  const dispatch = useAppDispatch();

  const inProgressApplets = useAppSelector(selectInProgressApplets);

  const { data: activityFlows } = useAppletDetailsQuery(appletId, {
    select: response => {
      return mapActivityFlowsFromDto(response.data.result.activityFlows);
    },
  });

  const selectEntityEvent = (entityId: string, eventId: string) =>
    inProgressApplets[appletId]?.[entityId]?.[eventId];

  const isEventInProgress = (event: StoreProgressPayload) =>
    event && !event.endAt;

  function activityStarted(activityId: string, eventId: string) {
    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
      }),
    );
  }

  function flowStarted(
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

  function startActivity(activityId: string, eventId: string) {
    return new Promise<boolean>(resolve => {
      const event = selectEntityEvent(activityId, eventId);

      if (isEventInProgress(event)) {
        onBeforeStartingActivity({
          onRestart: () => {
            activityStarted(activityId, eventId);
            resolve(true);
          },
          onResume: () => resolve(false),
        });
      } else {
        activityStarted(activityId, eventId);
        resolve(false);
      }
    });
  }

  function startFlow(
    flowId: string,
    currentActivityId: string,
    eventId: string,
  ) {
    return new Promise<boolean>(resolve => {
      const event = selectEntityEvent(flowId, eventId);

      if (isEventInProgress(event)) {
        onBeforeStartingActivity({
          onRestart: () => {
            const flow = activityFlows!.find(x => x.id === flowId);
            const firstActivityId = flow!.activityIds[0];

            flowStarted(flowId, firstActivityId, eventId, 0);
            resolve(true);
          },
          onResume: () => resolve(false),
        });
      } else {
        flowStarted(flowId, currentActivityId, eventId, 0);
        resolve(false);
      }
    });
  }

  return { startActivity, startFlow };
}

export default useInProgressEntities;
