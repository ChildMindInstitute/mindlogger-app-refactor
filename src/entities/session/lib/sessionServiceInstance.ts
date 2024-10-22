import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { SessionService } from './sessionService';

let instance: ReturnType<typeof SessionService>;
export const getDefaultSessionService = () => {
  if (!instance) {
    instance = SessionService(
      getDefaultStorageInstanceManager().getSessionStorage(),
    );
  }
  return instance;
};
