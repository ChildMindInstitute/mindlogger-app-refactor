import { clearEntityRecordStorages } from '@features/auth/lib/clearEntityRecordStorages.ts';
import { clearUploadQueueStorage } from '@features/auth/lib/clearUploadQueueStorage.ts';
import { getDefaultLogger } from '@shared/lib/services/loggerInstance.ts';

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
