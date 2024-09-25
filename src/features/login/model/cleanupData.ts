import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { clearEntityRecordStorages } from '../lib/clearEntityRecordStorages';
import { clearUploadQueueStorage } from '../lib/clearUploadQueueStorage';

export async function cleanupData() {
  getDefaultLogger().info(
    '[cleanupData] Processing cleanup upon another user login',
  );

  try {
    await clearEntityRecordStorages();
    clearUploadQueueStorage();

    getDefaultLogger().info(
      '[cleanupData] Cleanup operation completed successfully',
    );
  } catch (error) {
    getDefaultLogger().error(
      `[cleanupData] Processing cleanup failed with error: ${error}`,
    );
  }
}
