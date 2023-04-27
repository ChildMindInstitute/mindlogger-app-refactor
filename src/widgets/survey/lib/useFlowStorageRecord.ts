import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { createStorage } from '@app/shared/lib';

import { FlowPipelineItem } from '../model';

type UseFlowStorageArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
};

export type FlowState = {
  step: number;
  pipeline: FlowPipelineItem[];
};

const storage = createStorage('flow_progress-storage');

export function useFlowStorageRecord({
  appletId,
  eventId,
  flowId,
}: UseFlowStorageArgs) {
  const flowKey = flowId ?? 'default_one_step_flow';
  const key = `${flowKey}-${appletId}-${eventId}`;

  const [flowStorageRecord, upsertFlowStorageRecord] = useMMKVObject<FlowState>(
    key,
    storage,
  );

  const clearFlowStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key]);

  return {
    flowStorageRecord,
    upsertFlowStorageRecord,
    clearFlowStorageRecord,
  };
}
