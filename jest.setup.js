import { jest } from '@jest/globals';

import { StorageInstanceManager } from '@app/shared/lib/storages/StorageInstanceManager';

global.beforeEach(() => {
  jest
    .spyOn(StorageInstanceManager.prototype, 'getStoreEncryptionKey')
    .mockReturnValue('12345');
});
