import { getDefaultMediaFilesCleaner } from '@app/entities/activity/lib/services/mediaFilesCleanerInstance';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

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
