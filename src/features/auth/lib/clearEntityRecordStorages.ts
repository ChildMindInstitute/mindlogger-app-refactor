import { getDefaultMediaFilesCleaner } from '@entities/activity/lib/services/mediaFilesCleanerInstance';
import { getDefaultStorageInstanceManager } from '@shared/lib/storages/storageInstanceManagerInstance';

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
