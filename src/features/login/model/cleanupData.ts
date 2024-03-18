import { Logger } from '@shared/lib';

import { clearEntityRecordStorages, clearUploadQueueStorage } from '../lib';

export async function cleanupData() {
  Logger.info('[cleanupData] Processing cleanup upon another user login');

  try {
    await clearEntityRecordStorages();
    clearUploadQueueStorage();

    Logger.info('[cleanupData] Cleanup operation completed successfully');
  } catch (error) {
    Logger.error(
      `[cleanupData] Processing cleanup failed with error: ${error}`,
    );
  }
}
