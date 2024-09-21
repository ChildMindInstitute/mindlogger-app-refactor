import { createSecureStorage, createStorage } from '@app/shared/lib';

export const activityStorage = createSecureStorage('activity_progress-storage');
export const flowStorage = createStorage('flow_progress-storage');

export const clearStorageRecords = {
  byEventId: (eventId: string, targetSubjectId: string | null) => {
    const activityRecordKeys = activityStorage
      .getAllKeys()
      .filter(keys =>
        targetSubjectId === null
          ? keys.includes(eventId)
          : keys.includes(eventId) && keys.includes(targetSubjectId),
      );

    const flowRecordKeys = flowStorage
      .getAllKeys()
      .filter(keys =>
        targetSubjectId === null
          ? keys.includes(eventId)
          : keys.includes(eventId) && keys.includes(targetSubjectId),
      );

    activityRecordKeys.forEach(key => activityStorage.delete(key));
    flowRecordKeys.forEach(key => flowStorage.delete(key));
  },
};
