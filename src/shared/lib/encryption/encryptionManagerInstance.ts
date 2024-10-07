import { EncryptionManager } from './EncryptionManager';

let instance: EncryptionManager;
export const getDefaultEncryptionManager = () => {
  if (!instance) {
    instance = new EncryptionManager();
  }
  return instance;
};
