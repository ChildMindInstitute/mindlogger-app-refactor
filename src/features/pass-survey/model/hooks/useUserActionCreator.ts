import { ActivityState } from '../../lib/hooks/useActivityStorageRecord';
import { PipelineItemAnswerBase } from '../../lib/types/pipelineItemAnswer';
import { UserAction } from '../../lib/types/userAction';

type Args = {
  activityId: string;
  activityState: ActivityState | undefined;
};

export function useUserActionCreator({ activityId, activityState }: Args) {
  const getDefaultUserEventPayload = () => ({
    date: Date.now(),
    activityId,
    activityItemId: activityState!.items[activityState!.step].id as string,
  });

  const actionCreator = {
    next: () => ({
      type: 'NEXT',
      payload: getDefaultUserEventPayload(),
    }),
    back: () => ({
      type: 'PREV',
      payload: getDefaultUserEventPayload(),
    }),
    undo: () => ({
      type: 'UNDO',
      payload: getDefaultUserEventPayload(),
    }),
    done: () => ({
      type: 'DONE',
      payload: getDefaultUserEventPayload(),
    }),
    skip: () => ({
      type: 'SKIP',
      payload: getDefaultUserEventPayload(),
    }),
    saveAndProceedPopupConfirm: () => ({
      type: 'SKIP_POPUP_CONFIRM',
      payload: getDefaultUserEventPayload(),
    }),
    saveAndProceedPopupCancel: () => ({
      type: 'SKIP_POPUP_CANCEL',
      payload: getDefaultUserEventPayload(),
    }),
    setAnswer: (answer: PipelineItemAnswerBase) => {
      return {
        type: 'SET_ANSWER',
        payload: {
          ...getDefaultUserEventPayload(),
          answer,
        },
      };
    },
  } satisfies Record<string, (answer: PipelineItemAnswerBase) => UserAction>;

  return actionCreator;
}
