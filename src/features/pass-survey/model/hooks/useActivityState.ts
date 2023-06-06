import useUserActionManager from './useUserActionManager';
import {
  PipelineItemResponse,
  UserAction,
  useActivityStorageRecord,
} from '../../lib';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  order: number;
};

function useActivityState({
  appletId,
  activityId,
  eventId,
  order,
}: UseActivityPipelineArgs) {
  const {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorageRecord,
  } = useActivityStorageRecord({
    appletId,
    activityId,
    eventId,
    order,
  });

  const {
    userActionCreator,
    addUserAction,
    updateUserActionsWithAdditionalAnswer,
    updateUserActionsWithAnswer,
  } = useUserActionManager({
    activityId,
    activityState: activityStorageRecord,
  });

  function setStep(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    const previousStep = activityStorageRecord.step;

    const action =
      previousStep < step ? userActionCreator.next() : userActionCreator.back();

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      step,
      actions: addUserAction(action),
    });
  }

  function setAnswer(step: number, answer: PipelineItemResponse) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      answers: {
        ...activityStorageRecord.answers,
        [step]: {
          ...activityStorageRecord.answers?.[step],
          answer,
        },
      },
      actions: updateUserActionsWithAnswer(answer),
    });
  }

  function setAdditionalAnswer(step: number, answer: string) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      answers: {
        ...activityStorageRecord.answers,
        [step]: {
          ...activityStorageRecord.answers?.[step],
          additionalAnswer: answer,
        },
      },
      actions: updateUserActionsWithAdditionalAnswer(step, answer),
    });
  }

  function removeAnswer(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    const answers = { ...activityStorageRecord.answers };

    delete answers[step];

    const action = userActionCreator.undo();

    if (activityStorageRecord) {
      upsertActivityStorageRecord({
        ...activityStorageRecord,
        answers,
        actions: addUserAction(action),
      });
    }
  }

  function setTimer(step: number, progress: number) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,

      timers: {
        ...activityStorageRecord.timers,
        [step]: progress,
      },
    });
  }

  function removeTimer(step: number) {
    if (!activityStorageRecord?.timers) {
      return;
    }

    delete activityStorageRecord.timers[step];

    upsertActivityStorageRecord({
      ...activityStorageRecord,
    });
  }

  function trackUserAction(action: UserAction) {
    upsertActivityStorageRecord({
      ...activityStorageRecord!,
      actions: addUserAction(action),
    });
  }

  return {
    activityStorageRecord,
    userActionCreator,
    setStep,
    setAnswer,
    removeAnswer,
    setAdditionalAnswer,
    clearActivityStorageRecord,
    setTimer,
    removeTimer,
    trackUserAction,
  };
}

export default useActivityState;
