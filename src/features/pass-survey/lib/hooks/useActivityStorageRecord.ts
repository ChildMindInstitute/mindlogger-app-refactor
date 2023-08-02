import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { createSecureStorage } from '@app/shared/lib';

import { PipelineItem, PipelineItemAnswer, UserAction } from '../types';

type UseActivityStorageArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  order: number;
};

export type Answer = PipelineItemAnswer['value'];

export type Answers = Record<string, Answer>;

type Timers = Record<string, number>;

export type ActivityState = {
  step: number;
  items: PipelineItem[];
  answers: Answers;
  appletVersion: string;
  timers: Timers;
  actions: UserAction[];
  context: Record<string, unknown>;
};

const storage = createSecureStorage('activity_progress-storage');

export function useActivityStorageRecord({
  appletId,
  activityId,
  eventId,
  order,
}: UseActivityStorageArgs) {
  const key = `${appletId}-${activityId}-${eventId}-${order}`;

  const [activityStorageRecord, upsertActivityStorageRecord] =
    useMMKVObject<ActivityState>(key, storage);

  const clearActivityStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key]);

  const getCurrentActivityStorageRecord = useCallback(() => {
    const json = storage.getString(key);

    if (json) {
      return JSON.parse(json) as ActivityState;
    }
  }, [key]);

  return {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorageRecord,
    getCurrentActivityStorageRecord,
  };
}
