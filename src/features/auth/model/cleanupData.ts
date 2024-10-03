import { clearEntityRecordStorages } from '@features/auth/lib/clearEntityRecordStorages';
import { clearUploadQueueStorage } from '@features/auth/lib/clearUploadQueueStorage';
import { getDefaultLogger } from '@shared/lib/services/loggerInstance';

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
