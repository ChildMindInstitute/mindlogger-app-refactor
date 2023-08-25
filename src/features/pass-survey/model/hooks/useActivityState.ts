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
    getCurrentActivityStorageRecord,
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
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      step,
    });
  }

  function setAnswer(step: number, answer: PipelineItemResponse) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      answers: {
        ...currentStorageRecord.answers,
        [step]: {
          ...currentStorageRecord.answers?.[step],
          answer,
        },
      },
      actions: updateUserActionsWithAnswer(answer),
    });
  }

  function setContext(contextKey: string, contextValue: unknown) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      context: {
        ...currentStorageRecord.context,
        [contextKey]: contextValue,
      },
    });
  }

  function setAdditionalAnswer(step: number, answer: string) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      answers: {
        ...currentStorageRecord.answers,
        [step]: {
          ...currentStorageRecord.answers?.[step],
          additionalAnswer: answer,
        },
      },
      actions: updateUserActionsWithAdditionalAnswer(step, answer),
    });
  }

  function removeAnswer(step: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    const answers = { ...currentStorageRecord.answers };

    delete answers[step];

    const action = userActionCreator.undo();

    if (currentStorageRecord) {
      upsertActivityStorageRecord({
        ...currentStorageRecord,
        answers,
        actions: addUserAction(action),
      });
    }
  }

  function setTimer(step: number, progress: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,

      timers: {
        ...currentStorageRecord.timers,
        [step]: progress,
      },
    });
  }

  function removeTimer(step: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord?.timers) {
      return;
    }

    delete currentStorageRecord.timers[step];

    upsertActivityStorageRecord({
      ...currentStorageRecord,
    });
  }

  function trackUserAction(action: UserAction) {
    upsertActivityStorageRecord({
      ...getCurrentActivityStorageRecord()!,
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
    setContext,
  };
}

export default useActivityState;
