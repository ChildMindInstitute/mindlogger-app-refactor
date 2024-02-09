import useUserActionManager from './useUserActionManager';
import { PipelineItemResponse, UserAction, useActivityStorageRecord } from '../../lib';
import PipelineVisibilityChecker from '../PipelineVisibilityChecker';
import StepperUtils from '../StepperUtils';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  order: number;
};

function useActivityState({ appletId, activityId, eventId, order }: UseActivityPipelineArgs) {
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

  const { userActionCreator, addUserAction, updateUserActionsWithAdditionalAnswer, updateUserActionsWithAnswer } =
    useUserActionManager({
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
    upsertActivityStorageRecord({
      ...getCurrentActivityStorageRecord()!,
      actions: addUserAction(action),
    });
  }

  function removeAnswer(step: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    const answers = { ...currentStorageRecord.answers };

    delete answers[step];

    if (currentStorageRecord) {
      upsertActivityStorageRecord({
        ...currentStorageRecord,
        answers,
      });
    }
  }

  function iteratePipeline(fromStep: number, callback: (isItemVisible: boolean, step: number) => void) {
    for (let index = fromStep; index < activityStorageRecord!.items.length; index++) {
      const currentStorageRecord = getCurrentActivityStorageRecord()!;
      const visibilityChecker = PipelineVisibilityChecker(currentStorageRecord.items, currentStorageRecord.answers);
      const isItemVisible = visibilityChecker.isItemVisible(index);

      callback(isItemVisible, index);
    }
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
    removeAnswer,
    setAdditionalAnswer,
    clearActivityStorageRecord,
    setTimer,
    removeTimer,
    trackUserAction,
    setContext,
    iteratePipeline,

    getNextStepShift,
    getPreviousStepShift,
  };
}

export default useActivityState;
