import { createSecureStorage, createStorage } from '@app/shared/lib';

export const activityStorage = createSecureStorage('activity_progress-storage');
export const flowStorage = createStorage('flow_progress-storage');

export const clearStorageRecords = {
  byEventId: (eventId: string) => {
    const activityRecordKeys = activityStorage
      .getAllKeys()
      .filter((keys) => keys.includes(eventId));

    const flowRecordKeys = flowStorage
      .getAllKeys()
      .filter((keys) => keys.includes(eventId));

    activityRecordKeys.forEach((key) => activityStorage.delete(key));
    flowRecordKeys.forEach((key) => flowStorage.delete(key));
  },
};
