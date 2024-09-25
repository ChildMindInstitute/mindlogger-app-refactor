import { IMutex } from './common';

export interface IMutexDefaultInstanceManager {
  getRefreshServiceMutex: () => IMutex;
  getStartEntityMutex: () => IMutex;
  getAutoCompletionMutex: () => IMutex;
}
