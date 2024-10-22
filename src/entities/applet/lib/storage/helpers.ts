import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

export const clearStorageRecords = {
  byEventId: (eventId: string, targetSubjectId: string | null) => {
    const activityStorage =
      getDefaultStorageInstanceManager().getActivityProgressStorage();
    const flowStorage =
      getDefaultStorageInstanceManager().getFlowProgressStorage();

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
