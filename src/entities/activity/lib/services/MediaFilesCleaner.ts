import { FileSystem } from 'react-native-file-access';

import { ActivityRecordKeyParams } from '@app/abstract/lib';
import { createSecureStorage } from '@app/shared/lib';
import { MediaFile } from '@app/shared/ui';

type EntityRecord = {
  answers: Record<string, MediaFile | undefined>;
};

export const activityStorage = createSecureStorage('activity_progress-storage');

type Result = {
  cleanUp: (keyParams: ActivityRecordKeyParams) => void;
  cleanUpByStorageKey: (key: string) => void;
};

const createMediaFilesCleaner = (): Result => {
  const cleanUpByStorageKey = async (key: string) => {
    const storageActivityState = activityStorage.getString(key);

    if (!storageActivityState) {
      console.warn(
        "[MediaFilesCleaner.cleanUp]: Activity record doesn't exist",
      );
      return;
    }

    const entityRecord = JSON.parse(storageActivityState) as EntityRecord;

    console.log(entityRecord);

    const urlsToProcess: string[] = [];

    for (let recordId in entityRecord.answers) {
      const record = entityRecord.answers[recordId];

      if (record?.uri) {
        urlsToProcess.push(record.uri);
      }
    }

    for (let fileUrl of urlsToProcess) {
      try {
        const fileExists = await FileSystem.exists(fileUrl);

        if (fileExists) {
          await FileSystem.unlink(fileUrl);
        }
      } catch (error) {
        console.warn(
          '[MediaFilesCleaner.cleanUp]: Error occurred while deleting file',
        );
        console.error(error);
      }
    }

    console.info('[MediaFilesCleaner.cleanUp]: completed');
  };

  const cleanUp = async ({
    appletId,
    activityId,
    eventId,
    order,
  }: ActivityRecordKeyParams) => {
    const key = `${appletId}-${activityId}-${eventId}-${order}`;

    return cleanUpByStorageKey(key);
  };

  return {
    cleanUp,
    cleanUpByStorageKey,
  };
};

export default createMediaFilesCleaner();
