import { useMMKV, useMMKVObject } from 'react-native-mmkv';

import { PipelineItem } from '../types';

type UseActivityStorageArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

export type ActivityState = {
  step: number;
  items: PipelineItem[];
  answers: Record<string, any>;
};

export function useActivityStorageRecord({
  appletId,
  activityId,
  eventId,
}: UseActivityStorageArgs) {
  const storage = useMMKV({ id: 'activity_progress-storage' });

  const key = `${appletId}-${activityId}-${eventId}`;

  const [activityStorageRecord, upsertActivityStorageRecord] =
    useMMKVObject<ActivityState>(key, storage);

  function clearActivityStorage() {
    storage.delete(key);
  }

  return {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorage,
  };
}
