import { createSecureStorage, createStorage } from '@app/shared/lib';
import { MediaFilesCleaner } from '@entities/activity';

const activitiesStorage = createSecureStorage('activity_progress-storage');

const flowsStorage = createStorage('flow_progress-storage');

export const clearEntityRecordStorages = async () => {
  activitiesStorage.getAllKeys().forEach(activityKey => {
    MediaFilesCleaner.cleanUpByStorageKey(activityKey);
  });

  activitiesStorage.clearAll();

  flowsStorage.clearAll();
};
