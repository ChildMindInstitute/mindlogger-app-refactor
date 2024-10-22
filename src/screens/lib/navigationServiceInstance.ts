import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { NavigationService } from './navigationService';

let instance: ReturnType<typeof NavigationService>;
export const getDefaultNavigationService = () => {
  if (!instance) {
    instance = NavigationService(
      getDefaultStorageInstanceManager().getNavigationStorage(),
    );
  }
  return instance;
};
