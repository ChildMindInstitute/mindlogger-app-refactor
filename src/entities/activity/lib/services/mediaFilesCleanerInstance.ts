import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { createMediaFilesCleaner } from './MediaFilesCleaner';

let instance: ReturnType<typeof createMediaFilesCleaner>;
export const getDefaultMediaFilesCleaner = () => {
  if (!instance) {
    instance = createMediaFilesCleaner(
      getDefaultStorageInstanceManager().getActivityProgressStorage(),
    );
  }
  return instance;
};
