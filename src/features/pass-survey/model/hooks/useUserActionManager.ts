import useUserActionCreator from './useUserActionCreator';
import {
  ActivityState,
  PipelineItemResponse,
  SetAnswerAction,
  UserAction,
} from '../../lib';

type Args = {
  activityId: string;
  activityState: ActivityState | undefined;
};

const ITEMS_TO_UPDATE_USER_ACTION = ['TextInput', 'DrawingTest', 'AbTest'];

function useUserActionManager({ activityId, activityState }: Args) {
  const userActionCreator = useUserActionCreator({
    activityId,
    activityState,
  });

  const addUserAction = (action: UserAction) => {
    return [...activityState!.actions, action];
  };

  const updateUserAction = (action: UserAction) => {
    return activityState!.actions.map((o) => {
      return o.payload.activityItemId === action.payload.activityItemId &&
        o.type === action.type
        ? action
        : o;
    });
  };

  const updateUserActionsWithAnswer = (answer: PipelineItemResponse) => {
    const actions = activityState!.actions;
    const step = activityState!.step;
    const currentPipelineItem = activityState!.items[step];

    const lastUserAction = actions[actions.length - 1] as
      | SetAnswerAction
      | undefined;

    const shouldUpdateLastAction =
      lastUserAction &&
      lastUserAction?.payload?.activityItemId === currentPipelineItem.id &&
      lastUserAction.type === 'SET_ANSWER' &&
      ITEMS_TO_UPDATE_USER_ACTION.includes(currentPipelineItem.type);

    const action = userActionCreator.setAnswer({
      type: currentPipelineItem.type,
      value: {
        answer,
        additionalAnswer: activityState!.answers[step]?.additionalAnswer,
      },
    });

    if (shouldUpdateLastAction) {
      return updateUserAction(action);
    } else {
      return addUserAction(action);
    }
  };

  function updateUserActionsWithAdditionalAnswer(step: number, answer: string) {
    const actions = activityState!.actions;
    const currentPipelineItem = activityState!.items[step];
    const lastUserAction = actions[actions.length - 1] as
      | SetAnswerAction
      | undefined;

    const shouldUpdateLastAction =
      lastUserAction &&
      lastUserAction.type === 'SET_ANSWER' &&
      lastUserAction?.payload?.activityItemId === currentPipelineItem.id;

    const action = userActionCreator.setAnswer({
      type: currentPipelineItem.type,
      value: {
        answer: activityState!.answers[step]?.answer,
        additionalAnswer: answer,
      },
    });

    if (shouldUpdateLastAction) {
      return updateUserAction(action);
    } else {
      return addUserAction(action);
    }
  }

  return {
    userActionCreator,
    addUserAction,
    updateUserAction,
    updateUserActionsWithAnswer,
    updateUserActionsWithAdditionalAnswer,
  };
}

export default useUserActionManager;
