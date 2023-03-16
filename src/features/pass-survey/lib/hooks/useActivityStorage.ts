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

export function useActivityStorage({
  appletId,
  activityId,
  eventId,
}: UseActivityStorageArgs) {
  const storage = useMMKV({ id: 'activity_progress-storage' });

  const key = `${appletId}-${activityId}-${eventId}`;

  const [activityStorage, changeActivityStorage] = useMMKVObject<ActivityState>(
    key,
    storage,
  );

  function clearActivityStorage() {
    storage.delete(key);
  }

  return {
    activityStorage,
    changeActivityStorage,
    clearActivityStorage,
  };
}
