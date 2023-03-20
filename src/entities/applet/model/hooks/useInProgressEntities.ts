import { useAppDispatch, useAppSelector } from '@shared/lib';

import { actions } from '..';
import { onBeforeStartingActivity } from '../../lib';
import { selectInProgressApplets } from '../selectors';

function useInProgressEntities(appletId: string) {
  const dispatch = useAppDispatch();
  const inProgressApplets = useAppSelector(selectInProgressApplets);

  const selectEntityEvent = (entityId: string, eventId: string) =>
    inProgressApplets[appletId]?.[entityId]?.[eventId];

  function restartActivity(activityId: string, eventId: string) {
    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
      }),
    );
  }

  function restartFlow(flowId: string, activityId: string, eventId: string) {
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
          onRestart: () => restartActivity(activityId, eventId),
          onResume: () => resolve(event),
        });
      }
    });
  }

  function startFlow(flowId: string, activityId: string, eventId: string) {
    return new Promise(resolve => {
      const event = selectEntityEvent(flowId, eventId);

      if (event) {
        onBeforeStartingActivity({
          onRestart: () => restartFlow(flowId, activityId, eventId),
          onResume: () => resolve(event),
        });
      } else {
        resolve(event);
      }
    });
  }

  return { startActivity, startFlow };
}

export default useInProgressEntities;
