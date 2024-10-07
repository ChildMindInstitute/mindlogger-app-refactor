import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { LocalizationStorage } from './LocalizationStorage';

let instance: ReturnType<typeof LocalizationStorage>;
export const getDefaultLocalizationStorage = () => {
  if (!instance) {
    instance = LocalizationStorage(
      getDefaultStorageInstanceManager().getLocalizationStorage(),
    );
  }
  return instance;
};
