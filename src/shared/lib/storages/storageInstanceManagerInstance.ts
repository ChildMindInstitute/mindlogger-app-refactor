import { StorageInstanceManager } from './StorageInstanceManager';

let instance: StorageInstanceManager;
export const getDefaultStorageInstanceManager = () => {
  if (!instance) {
    instance = new StorageInstanceManager();
  }
  return instance;
};
