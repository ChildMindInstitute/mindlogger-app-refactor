import { ActivityState } from '@app/features/pass-survey';
import { createSecureStorage, createStorage } from '@app/shared/lib';

import { FlowState } from './useFlowStorageRecord';

const activityProgressStorage = createSecureStorage(
  'activity_progress-storage',
);

const flowProgressStorage = createStorage('flow_progress-storage');

export const getActivityRecordKey = (
  appletId: string,
  activityId: string,
  eventId: string,
  order: number,
) => {
  return `${appletId}-${activityId}-${eventId}-${order}`;
};

export const getActivityRecord = (
  appletId: string,
  activityId: string,
  eventId: string,
  order: number,
): ActivityState | null => {
  const key = getActivityRecordKey(appletId, activityId, eventId, order);
  const json = activityProgressStorage.getString(key);

  return !json ? null : (JSON.parse(json) as ActivityState);
};

export const clearActivityStorageRecord = (
  appletId: string,
  activityId: string,
  eventId: string,
  order: number,
) => {
  const key = getActivityRecordKey(appletId, activityId, eventId, order);
  activityProgressStorage.delete(key);
};

export const getFlowRecordKey = (
  flowId: string | undefined,
  appletId: string,
  eventId: string,
) => {
  const flowKey = flowId ?? 'default_one_step_flow';
  return `${flowKey}-${appletId}-${eventId}`;
};

export const getFlowRecord = (
  flowId: string | undefined,
  appletId: string,
  eventId: string,
): FlowState | null => {
  const key = getFlowRecordKey(flowId, appletId, eventId);

  const json = flowProgressStorage.getString(key);

  return !json ? null : (JSON.parse(json) as FlowState);
};
