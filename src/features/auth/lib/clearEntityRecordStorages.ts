import { getDefaultMediaFilesCleaner } from '@entities/activity/lib/services/mediaFilesCleanerInstance.ts';
import { getDefaultStorageInstanceManager } from '@shared/lib/storages/storageInstanceManagerInstance.ts';

export const clearEntityRecordStorages = async () => {
  const activitiesStorage =
    getDefaultStorageInstanceManager().getActivityProgressStorage();

  const flowsStorage =
    getDefaultStorageInstanceManager().getFlowProgressStorage();

  activitiesStorage.getAllKeys().forEach(activityKey => {
    getDefaultMediaFilesCleaner().cleanUpByStorageKey(activityKey);
  });

  activitiesStorage.clearAll();

  flowsStorage.clearAll();
};
