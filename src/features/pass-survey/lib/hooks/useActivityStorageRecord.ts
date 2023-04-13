import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { createSecureStorage } from '@app/shared/lib';

import { PipelineItem, PipelineItemAnswer } from '../types';

type UseActivityStorageArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

export type Answer = PipelineItemAnswer['value'];

export type Answers = Record<string, Answer>;

type Timer = {
  progress: number;
};

export type ActivityState = {
  step: number;
  items: PipelineItem[];
  answers: Answers;
  appletVersion: string;
  timer?: Timer;
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
