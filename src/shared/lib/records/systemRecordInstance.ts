import { SystemRecord } from './SystemRecord';
import { getDefaultStorageInstanceManager } from '../storages/storageInstanceManagerInstance';

let instance: ReturnType<typeof SystemRecord>;
export const getDefaultSystemRecord = () => {
  if (!instance) {
    instance = SystemRecord(
      getDefaultStorageInstanceManager().getSystemStorage(),
    );
  }
  return instance;
};
