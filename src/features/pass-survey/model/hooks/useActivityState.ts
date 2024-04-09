import useUserActionManager from './useUserActionManager';
import {
  PipelineItemResponse,
  UserAction,
  useActivityStorageRecord,
} from '../../lib';
import PipelineVisibilityChecker from '../PipelineVisibilityChecker';
import StepperUtils from '../StepperUtils';

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
    removeDuplicateUserAnswers,
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
      actions: removeDuplicateUserAnswers(updateUserActionsWithAnswer(answer)),
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

  function undoAnswer(step: number) {
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
    const currentStorageRecord = getCurrentActivityStorageRecord()!;

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      actions: [...currentStorageRecord.actions, action],
    });
  }

  function iterateWithConditionalLogic(fromStep: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord()!;
    const answers = { ...(currentStorageRecord.answers ?? {}) };
    const timers = currentStorageRecord?.timers;
    const items = currentStorageRecord.items ?? {};

    for (
      let index = fromStep;
      index < activityStorageRecord!.items.length;
      index++
    ) {
      const visibilityChecker = PipelineVisibilityChecker(items, answers);
      const isItemVisible = visibilityChecker.isItemVisible(index);

      if (isItemVisible) {
        continue;
      }

      delete answers[index];

      if (timers) {
        delete timers[index];
      }
    }

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      answers,
      timers,
    });
  }

  function getNextStepShift() {
    const stepperUtils = new StepperUtils(getCurrentActivityStorageRecord()!);

    return stepperUtils.getNextStepShift();
  }

  function getPreviousStepShift() {
    const stepperUtils = new StepperUtils(getCurrentActivityStorageRecord()!);

    return stepperUtils.getPreviousStepShift();
  }

  return {
    activityStorageRecord,
    userActionCreator,
    setStep,
    setAnswer,
    undoAnswer,
    setAdditionalAnswer,
    clearActivityStorageRecord,
    setTimer,
    removeTimer,
    trackUserAction,
    setContext,
    iterateWithConditionalLogic,

    getNextStepShift,
    getPreviousStepShift,
  };
}

export default useActivityState;
