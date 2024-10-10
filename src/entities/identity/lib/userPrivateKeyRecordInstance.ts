import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { UserPrivateKeyRecord } from './userPrivateKeyRecord';

let defaultRecord: ReturnType<typeof UserPrivateKeyRecord>;
export const getDefaultUserPrivateKeyRecord = () => {
  if (!defaultRecord) {
    defaultRecord = UserPrivateKeyRecord(
      getDefaultStorageInstanceManager().getUserPrivateKeyStorage(),
    );
  }
  return defaultRecord;
};
