import { IMutex } from '@shared/lib/utils/IMutex';

export interface IMutexDefaultInstanceManager {
  getRefreshServiceMutex: () => IMutex;
  getStartEntityMutex: () => IMutex;
  getAutoCompletionMutex: () => IMutex;
}
