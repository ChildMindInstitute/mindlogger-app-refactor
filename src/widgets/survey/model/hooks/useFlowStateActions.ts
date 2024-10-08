import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { FlowPipelineItem } from '@widgets/survey/model/IPipelineBuilder';

import {
  ActivitySummaryData,
  FlowState,
  FlowSummaryData,
  SummaryDataKey,
  useFlowStorageRecord,
} from '../../lib/useFlowStorageRecord';

export type UseFlowStateActionsArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
};

export function useFlowStateActions({
  appletId,
  eventId,
  flowId,
  targetSubjectId,
}: UseFlowStateActionsArgs) {
  const {
    upsertFlowStorageRecord,
    clearFlowStorageRecord,
    getCurrentFlowStorageRecord,
  } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const getStep = (record?: FlowState): number => {
    return record?.step ?? 0;
  };

  const getPipeline = (record?: FlowState): FlowPipelineItem[] => {
    return record?.pipeline ?? [];
  };

  const isLastStep = (record?: FlowState): boolean => {
    const pipeline = getPipeline(record);
    const step = getStep(record);
    return !!pipeline.length && step === pipeline.length - 1;
  };

  const isSummaryStep = (record?: FlowState): boolean => {
    const pipeline = getPipeline(record);
    const step = getStep(record);
    return !!pipeline.length && pipeline[step].type === 'Summary';
  };

  function next() {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    if (isLastStep(record)) {
      return;
    }

    const step = getStep(record);

    upsertFlowStorageRecord({
      ...record,
      step: step + 1,
    });
  }

  function saveActivitySummary(activitySummary: ActivitySummaryData) {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    const updatedContext: Record<string, unknown> = {
      ...(record.context ?? {}),
    };

    const { alerts, scores, activityId } = activitySummary;

    const summaryData: FlowSummaryData = (record.context?.[SummaryDataKey] ??
      {}) as FlowSummaryData;

    summaryData[activityId] = {
      alerts,
      scores,
      order: activitySummary.order,
    };

    updatedContext[SummaryDataKey] = summaryData;

    upsertFlowStorageRecord({
      ...record,
      context: updatedContext,
    });
  }

  function idleTimeoutNext() {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    if (isLastStep(record)) {
      return;
    }

    const pipeline = getPipeline(record);

    const hasSummaryStep = pipeline.some(x => x.type === 'Summary');

    const step = getStep(record);

    const isNextStepSummary =
      hasSummaryStep && pipeline[step + 1]?.type === 'Summary';

    upsertFlowStorageRecord({
      ...record,
      step: isNextStepSummary ? step + 2 : step + 1,
    });
  }

  function back() {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    const pipeline = getPipeline(record);

    const step = getStep(record);

    const currentItem = pipeline[step];

    if (currentItem.type === 'Intermediate') {
      upsertFlowStorageRecord({
        ...record,
        step: step - 1,
      });
    }
  }

  function completeByTimer(timerType: 'event' | 'availability'): void {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    getDefaultLogger().log(
      `[useFlowStateActions.completeByTimer] Executing, current step is: ${record.step}, timer type: ${timerType}`,
    );

    if (!canBeCompletedByTimer()) {
      getDefaultLogger().log(
        `[useFlowStateActions.completeByTimer] Cancelled as we're on either finish or summary step, timer type: ${timerType}`,
      );
      return;
    }

    const pipeline = getPipeline(record);

    upsertFlowStorageRecord({
      ...record,
      step: pipeline.length - 1,
      isCompletedDueToTimer: true,
      interruptionStep: record.step,
    });
  }

  function canBeCompletedByTimer(): boolean {
    const record: FlowState = getCurrentFlowStorageRecord()!;

    const result = !isLastStep(record) && !isSummaryStep(record);

    getDefaultLogger().log(
      `[useFlowStateActions.canBeCompletedByTimer]: ${String(result)}`,
    );

    return result;
  }

  return {
    next,
    idleTimeoutNext,
    back,
    completeByTimer,
    clearFlowStorageRecord,
    saveActivitySummary,
    canBeCompletedByTimer,
  };
}
