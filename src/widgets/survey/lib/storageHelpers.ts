import { ActivityState } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { FlowState } from './useFlowStorageRecord';

export const getActivityRecordKey = (
  appletId: string,
  activityId: string,
  eventId: string,
  targetSubjectId: string | null,
  order: number,
) => {
  return `${appletId}-${activityId}-${eventId}-${targetSubjectId || 'NULL'}-${order}`;
};

export const getActivityRecord = (
  appletId: string,
  activityId: string,
  eventId: string,
  targetSubjectId: string | null,
  order: number,
): ActivityState | null => {
  const key = getActivityRecordKey(
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  );
  const json = getDefaultStorageInstanceManager()
    .getActivityProgressStorage()
    .getString(key);

  return !json ? null : (JSON.parse(json) as ActivityState);
};

export const activityRecordExists = (
  appletId: string,
  activityId: string,
  eventId: string,
  targetSubjectId: string | null,
  order: number,
): boolean => {
  const record = getActivityRecord(
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  );

  return !!record;
};

export const clearActivityStorageRecord = (
  appletId: string,
  activityId: string,
  eventId: string,
  targetSubjectId: string | null,
  order: number,
) => {
  const key = getActivityRecordKey(
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  );
  getDefaultStorageInstanceManager().getActivityProgressStorage().delete(key);
};

export const getFlowRecordKey = (
  flowId: string | undefined,
  appletId: string,
  eventId: string,
  targetSubjectId: string | null,
) => {
  const flowKey = flowId ?? 'default_one_step_flow';
  return `${flowKey}-${appletId}-${eventId}-${targetSubjectId || 'NULL'}`;
};

export const getFlowRecord = (
  flowId: string | undefined,
  appletId: string,
  eventId: string,
  targetSubjectId: string | null,
): FlowState | null => {
  const key = getFlowRecordKey(flowId, appletId, eventId, targetSubjectId);

  const json = getDefaultStorageInstanceManager()
    .getFlowProgressStorage()
    .getString(key);

  return !json ? null : (JSON.parse(json) as FlowState);
};

export const isCurrentActivityRecordExist = (
  flowId: string | undefined,
  appletId: string,
  eventId: string,
  targetSubjectId: string | null,
) => {
  if (flowId) {
    // We handle only single activities: M2-6153
    return true;
  }

  const flowRecord = getFlowRecord(flowId, appletId, eventId, targetSubjectId);
  if (!flowRecord) {
    return false;
  }

  const pipelineItem = flowRecord.pipeline[flowRecord.step];
  if (!pipelineItem) {
    return false;
  }

  const { activityId, order } = pipelineItem.payload;

  const activityRecord = getActivityRecord(
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  );

  return !!activityRecord;
};
