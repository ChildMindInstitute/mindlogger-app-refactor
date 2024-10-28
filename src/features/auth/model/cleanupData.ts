import { clearEntityRecordStorages } from '@features/auth/lib/clearEntityRecordStorages';
import { clearUploadQueueStorage } from '@features/auth/lib/clearUploadQueueStorage';
import { getDefaultLogger } from '@shared/lib/services/loggerInstance';

// Clear entity record and progression data.
// This function should only be called upon successful login, and that the
// just logged-in user's ID is not the same as the previously logged-in user's
// ID.
// This function should not be called upon log out. This way, previously stored
// entity record and progression data can be preserved for the same user over
// multiple sessions. This is an intended behaviour.
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
