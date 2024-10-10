import { useMemo } from 'react';

import { FlowPipelineItem } from '@widgets/survey/model/IPipelineBuilder';

import {
  FlowSummaryData,
  SummaryDataKey,
  useFlowStorageRecord,
} from '../../lib/useFlowStorageRecord';

export type UseFlowStateArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
};

export function useFlowState({
  appletId,
  eventId,
  flowId,
  targetSubjectId,
}: UseFlowStateArgs) {
  const { flowStorageRecord: record } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const step = record?.step ?? 0;

  const pipeline: FlowPipelineItem[] = record?.pipeline ?? [];

  const flowSummaryData: FlowSummaryData = (record?.context?.[SummaryDataKey] ??
    {}) as FlowSummaryData;

  const remainingActivityIds: string[] = useMemo(() => {
    if (!record?.pipeline.length || record?.step == null) {
      return [];
    }

    const restActivitySteps = record.pipeline
      .slice(record.step)
      .filter(x => x.type === 'Stepper');
    return restActivitySteps.map(x => x.payload.activityId);
  }, [record?.pipeline, record?.step]);

  return {
    step,
    isTimerElapsed: record?.isCompletedDueToTimer ?? false,
    interruptionStep: record?.interruptionStep ?? null,
    pipeline,
    flowSummaryData,
    remainingActivityIds,
  };
}
