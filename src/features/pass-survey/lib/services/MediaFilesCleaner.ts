import { FileSystem } from 'react-native-file-access';

import { ActivityRecordKeyParams } from '@app/abstract/lib/types/storage';
import { createSecureStorage } from '@app/shared/lib';

import { ActivityState } from '../hooks';
import { AudioResponse, PhotoResponse, VideoResponse } from '../types';

export const activityStorage = createSecureStorage('activity_progress-storage');

type Result = {
  cleanUp: (keyParams: ActivityRecordKeyParams) => void;
};

const createMediaFilesCleaner = (): Result => {
  const cleanUp = async ({
    appletId,
    activityId,
    eventId,
    order,
  }: ActivityRecordKeyParams) => {
    const key = `${appletId}-${activityId}-${eventId}-${order}`;

    const storageActivityState = activityStorage.getString(key);

    if (!storageActivityState) {
      console.warn(
        "[MediaFilesCleaner.cleanUp]: Activity record doesn't exist",
      );
      return;
    }

    const activityState = JSON.parse(storageActivityState) as ActivityState;

    const urlsToProcess: string[] = [];

    for (let i = 0; i < activityState.items.length; i++) {
      let item = activityState.items[i];

      switch (item.type) {
        case 'Photo': {
          const answer = activityState.answers[i]?.answer as PhotoResponse;

          if (answer?.uri) {
            urlsToProcess.push(answer.uri);
          }
          break;
        }
        case 'Video': {
          const answer = activityState.answers[i]?.answer as VideoResponse;

          if (answer?.uri) {
            urlsToProcess.push(answer.uri);
          }
          break;
        }
        case 'Audio': {
          const answer = activityState.answers[i]?.answer as AudioResponse;

          if (answer?.uri) {
            urlsToProcess.push(answer.uri);
          }
        }
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

  return {
    cleanUp,
  };
};

export default createMediaFilesCleaner();
