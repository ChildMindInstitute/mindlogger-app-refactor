import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { Report } from '@app/entities/activity';
import { createSecureStorage } from '@app/shared/lib';

import { PipelineItem, PipelineItemAnswer, UserAction } from '../types';

// M2-7407 update activity state
type UseActivityStorageArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
};

export type Answer = PipelineItemAnswer['value'];

type ZeroBasedIndex = string;

export type Answers = Record<ZeroBasedIndex, Answer>;

type Timers = Record<string, number>;

export type ActivityState = {
  step: number;
  items: PipelineItem[];
  answers: Answers;
  appletVersion: string;
  timers: Timers;
  actions: UserAction[];
  scoreSettings: Array<Report>;
  hasSummary: boolean;
  context: Record<string, unknown>;
};

const storage = createSecureStorage('activity_progress-storage');

export function useActivityStorageRecord({
  appletId,
  activityId,
  eventId,
  targetSubjectId,
  order,
}: UseActivityStorageArgs) {
  const key = `${appletId}-${activityId}-${eventId}-${targetSubjectId || 'NULL'}-${order}`;

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
