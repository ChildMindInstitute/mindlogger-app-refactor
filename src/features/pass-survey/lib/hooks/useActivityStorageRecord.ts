import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { Report } from '@app/entities/activity/lib/types/activityReportSettings';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { PipelineItem } from '../types/payload';
import { PipelineItemAnswer } from '../types/pipelineItemAnswer';
import { UserAction } from '../types/userAction';

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

export function useActivityStorageRecord({
  appletId,
  activityId,
  eventId,
  targetSubjectId,
  order,
}: UseActivityStorageArgs) {
  const key = `${appletId}-${activityId}-${eventId}-${targetSubjectId || 'NULL'}-${order}`;

  const [activityStorageRecord, upsertActivityStorageRecord] =
    useMMKVObject<ActivityState>(
      key,
      getDefaultStorageInstanceManager().getActivityProgressStorage(),
    );

  const clearActivityStorageRecord = useCallback(() => {
    getDefaultStorageInstanceManager().getActivityProgressStorage().delete(key);
  }, [key]);

  const getCurrentActivityStorageRecord = useCallback(() => {
    const json = getDefaultStorageInstanceManager()
      .getActivityProgressStorage()
      .getString(key);

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
