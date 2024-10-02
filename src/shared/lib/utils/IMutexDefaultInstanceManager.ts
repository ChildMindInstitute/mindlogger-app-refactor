import { IMutex } from '@shared/lib/utils/IMutex.ts';

export interface IMutexDefaultInstanceManager {
  getRefreshServiceMutex: () => IMutex;
  getStartEntityMutex: () => IMutex;
  getAutoCompletionMutex: () => IMutex;
}
