import { MediaFilesCleaner } from '@app/features/pass-survey/lib/services';
import { createSecureStorage, createStorage } from '@app/shared/lib';

const activitiesStorage = createSecureStorage('activity_progress-storage');

const flowsStorage = createStorage('flow_progress-storage');

export const clearEntityRecordStorages = async () => {
  activitiesStorage.getAllKeys().forEach(activityKey => {
    MediaFilesCleaner.cleanUpByStorageKey(activityKey);
  });

  activitiesStorage.clearAll();

  flowsStorage.clearAll();
};
