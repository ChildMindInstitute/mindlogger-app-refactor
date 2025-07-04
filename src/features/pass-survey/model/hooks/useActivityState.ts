import { useUserActionManager } from './useUserActionManager';
import { useActivityStorageRecord } from '../../lib/hooks/useActivityStorageRecord';
import { UserActionsPostProcessorService } from '../../lib/services/UserActionsPostProcessorService';
import { PipelineItem, PipelineItemResponse } from '../../lib/types/payload';
import { UserAction } from '../../lib/types/userAction';
import { PipelineVisibilityChecker } from '../PipelineVisibilityChecker';
import { StepperUtils } from '../StepperUtils';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
};

export function useActivityState({
  appletId,
  activityId,
  eventId,
  targetSubjectId,
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
    targetSubjectId,
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

  const userActionsPostProcessorService = new UserActionsPostProcessorService();

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

  function postProcessUserActionsForCurrentItem() {
    const currentStorageRecord = getCurrentActivityStorageRecord()!;

    upsertActivityStorageRecord({
      ...currentStorageRecord,
      actions:
        userActionsPostProcessorService.postProcessUserActions(
          currentStorageRecord,
        ),
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

  function setSubStep(step: number, subStep: number) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    const items = [...currentStorageRecord.items];
    if (items[step]) {
      items[step] = {
        ...items[step],
        subStep,
      };

      upsertActivityStorageRecord({
        ...currentStorageRecord,
        items,
      });
    }
  }

  function setItemCustomProperty<T extends PipelineItem>(
    step: number,
    property: keyof T,
    value: T[keyof T],
  ) {
    const currentStorageRecord = getCurrentActivityStorageRecord();

    if (!currentStorageRecord) {
      return;
    }

    const items = [...currentStorageRecord.items];
    if (items[step]) {
      items[step] = {
        ...items[step],
        [property]: value,
      };

      upsertActivityStorageRecord({
        ...currentStorageRecord,
        items,
      });
    }
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
    setSubStep,
    setItemCustomProperty,

    getNextStepShift,
    getPreviousStepShift,
    postProcessUserActionsForCurrentItem,
  };
}
