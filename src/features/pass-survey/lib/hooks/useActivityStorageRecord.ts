import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { createSecureStorage } from '@app/shared/lib';

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
  appletVersion: string;
};

const storage = createSecureStorage('activity_progress-storage');

export function useActivityStorageRecord({
  appletId,
  activityId,
  eventId,
}: UseActivityStorageArgs) {
  const key = `${appletId}-${activityId}-${eventId}`;

  const [activityStorageRecord, upsertActivityStorageRecord] =
    useMMKVObject<ActivityState>(key, storage);

  const clearActivityStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key]);

  return {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorageRecord,
  };
}
