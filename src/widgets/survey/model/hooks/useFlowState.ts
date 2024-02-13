import {
  FlowSummaryData,
  SummaryDataKey,
  useFlowStorageRecord,
} from '../../lib';
import { FlowPipelineItem } from '../pipelineBuilder';

export type UseFlowStateArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
};

export function useFlowState({ appletId, eventId, flowId }: UseFlowStateArgs) {
  const { flowStorageRecord: record } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
  });

  const step = record?.step ?? 0;

  const pipeline: FlowPipelineItem[] = record?.pipeline ?? [];

  const flowSummaryData: FlowSummaryData = (record?.context?.[SummaryDataKey] ??
    {}) as FlowSummaryData;

  return {
    step,
    isTimerElapsed: record?.isCompletedDueToTimer ?? false,
    pipeline,
    flowSummaryData,
  };
}
