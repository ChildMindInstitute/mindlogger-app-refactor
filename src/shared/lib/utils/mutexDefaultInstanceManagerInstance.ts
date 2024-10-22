import { MutexDefaultInstanceManager } from './mutexInstances';

let instance: MutexDefaultInstanceManager;
export const getMutexDefaultInstanceManager = () => {
  if (!instance) {
    instance = new MutexDefaultInstanceManager();
  }
  return instance;
};
