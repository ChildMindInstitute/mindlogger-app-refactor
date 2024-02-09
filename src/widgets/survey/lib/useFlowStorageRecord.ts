import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { AnswerAlerts, ScoreRecord } from '@app/features/pass-survey';
import { createStorage } from '@app/shared/lib';

import { FlowPipelineItem } from '../model';

type UseFlowStorageArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
};

type ActivityId = string;

export const SummaryDataKey = 'SummaryData';

export type ActivitySummaryData = {
  activityId: ActivityId;
  alerts: AnswerAlerts;
  scores: ActivityScores;
  order: number;
};

export type ActivityScores = {
  activityName: string;
  scores: ScoreRecord[];
};

export type FlowSummaryData = Record<
  ActivityId,
  {
    alerts: AnswerAlerts;
    scores: ActivityScores;
    order: number;
  }
>;

export type FlowState = {
  step: number;
  pipeline: FlowPipelineItem[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

const storage = createStorage('flow_progress-storage');

export function useFlowStorageRecord({ appletId, eventId, flowId }: UseFlowStorageArgs) {
  const flowKey = flowId ?? 'default_one_step_flow';
  const key = `${flowKey}-${appletId}-${eventId}`;

  const [flowStorageRecord, upsertFlowStorageRecord] = useMMKVObject<FlowState>(key, storage);

  const clearFlowStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key]);

  const getCurrentFlowStorageRecord = useCallback(() => {
    const json = storage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowState;
    }
  }, [key]);

  return {
    flowStorageRecord,
    upsertFlowStorageRecord,
    clearFlowStorageRecord,
    getCurrentFlowStorageRecord,
  };
}
