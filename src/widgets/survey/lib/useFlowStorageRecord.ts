import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import {
  AnswerAlerts,
  ScoreRecord,
} from '@app/features/pass-survey/lib/types/summary';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { getFlowRecordKey } from './storageHelpers';
import { FlowPipelineItem } from '../model/pipelineBuilder';

export type UseFlowStorageArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
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
  flowName: string | null;
  scheduledDate: number | null;
  pipeline: FlowPipelineItem[];
  isCompletedDueToTimer: boolean;
  interruptionStep: number | null;
  context: Record<string, unknown>;
};

export function useFlowStorageRecord({
  appletId,
  eventId,
  flowId,
  targetSubjectId,
}: UseFlowStorageArgs) {
  const key = getFlowRecordKey(flowId, appletId, eventId, targetSubjectId);
  const storage = getDefaultStorageInstanceManager().getFlowProgressStorage();

  const [flowStorageRecord, upsertFlowStorageRecord] = useMMKVObject<FlowState>(
    key,
    storage,
  );

  const clearFlowStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key, storage]);

  const getCurrentFlowStorageRecord = useCallback(() => {
    const json = storage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowState;
    }
  }, [key, storage]);

  return {
    flowStorageRecord,
    upsertFlowStorageRecord,
    clearFlowStorageRecord,
    getCurrentFlowStorageRecord,
  };
}
