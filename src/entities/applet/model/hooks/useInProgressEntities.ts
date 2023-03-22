import { useAppDispatch, useAppSelector } from '@shared/lib';

import { onBeforeStartingActivity } from '../../lib';
import { selectInProgressApplets } from '../selectors';
import { actions } from '../slice';

function useInProgressEntities(appletId: string) {
  const dispatch = useAppDispatch();
  const inProgressApplets = useAppSelector(selectInProgressApplets);

  const selectEntityEvent = (entityId: string, eventId: string) =>
    inProgressApplets[appletId]?.[entityId]?.[eventId];

  function activityStarted(activityId: string, eventId: string) {
    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
      }),
    );
  }

  function flowStarted(flowId: string, activityId: string, eventId: string) {
    dispatch(
      actions.flowStarted({
        appletId,
        flowId,
        activityId,
        eventId,
      }),
    );
  }

  function startActivity(activityId: string, eventId: string) {
    return new Promise(resolve => {
      const event = selectEntityEvent(activityId, eventId);

      if (event) {
        onBeforeStartingActivity({
          onRestart: () => {
            activityStarted(activityId, eventId);
            resolve(event);
          },
          onResume: () => resolve(event),
        });
      } else {
        activityStarted(activityId, eventId);
        resolve(event);
      }
    });
  }

  function startFlow(flowId: string, activityId: string, eventId: string) {
    return new Promise(resolve => {
      const event = selectEntityEvent(flowId, eventId);

      if (event) {
        onBeforeStartingActivity({
          onRestart: () => {
            flowStarted(flowId, activityId, eventId);
            resolve(event);
          },
          onResume: () => resolve(event),
        });
      } else {
        flowStarted(flowId, activityId, eventId);
        resolve(event);
      }
    });
  }

  return { startActivity, startFlow };
}

export default useInProgressEntities;
