import { useState } from 'react';

import { useFlowStorageRecord } from '../../lib';

export type UseFlowStateArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
};

export function useFlowState({ appletId, eventId, flowId }: UseFlowStateArgs) {
  const { flowStorageRecord, upsertFlowStorageRecord, clearFlowStorageRecord } =
    useFlowStorageRecord({
      appletId,
      eventId,
      flowId,
    });

  const step = flowStorageRecord?.step ?? 0;
  const pipeline = flowStorageRecord?.pipeline ?? [];

  const [isTimerElapsed, setIsTimerElapsed] = useState(false);

  const isLastStep = pipeline && step === pipeline.length - 1;

  function next() {
    if (isLastStep) {
      return;
    }

    upsertFlowStorageRecord({
      ...flowStorageRecord!,
      step: step + 1,
    });
  }

  function back() {
    const currentItem = pipeline![step];

    if (currentItem.type === 'Intermediate') {
      upsertFlowStorageRecord({
        ...flowStorageRecord!,
        step: step - 1,
      });
    }
  }

  function completeByTimer() {
    if (isLastStep) {
      return;
    }

    upsertFlowStorageRecord({
      ...flowStorageRecord!,
      step: pipeline!.length - 1,
    });
    setIsTimerElapsed(true);
  }

  return {
    step,
    next,
    back,
    completeByTimer,
    isTimerElapsed,
    pipeline,
    clearFlowStorageRecord,
  };
}
