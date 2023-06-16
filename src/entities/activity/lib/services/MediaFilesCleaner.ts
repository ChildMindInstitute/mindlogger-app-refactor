import { FileSystem } from 'react-native-file-access';

import { ActivityRecordKeyParams } from '@app/abstract/lib';
import { AnswerDto, ObjectAnswerDto } from '@app/shared/api';
import { createSecureStorage } from '@app/shared/lib';
import { MediaFile, MediaValue } from '@app/shared/ui';

type EntityRecord = {
  answers: Record<string, { answer: MediaFile } | undefined>;
};

export const activityStorage = createSecureStorage('activity_progress-storage');

type Result = {
  cleanUp: (keyParams: ActivityRecordKeyParams) => void;
  cleanUpByStorageKey: (key: string) => void;
  cleanUpByAnswers: (answers: AnswerDto[]) => void;
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

    const urlsToProcess: string[] = [];

    for (let recordId in entityRecord.answers) {
      const record = entityRecord.answers[recordId]?.answer;

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

  const cleanUpByAnswers = async (answers: AnswerDto[]) => {
    try {
      answers.forEach(async answer => {
        const { value: answerValue } = answer as ObjectAnswerDto;

        const mediaValue = answerValue as MediaValue;

        if (mediaValue?.uri) {
          const fileExists = await FileSystem.exists(mediaValue.uri);

          if (fileExists) {
            await FileSystem.unlink(mediaValue.uri);

            console.info('[MediaFilesCleaner.cleanUp]: completed');
          }
        }
      });
    } catch (error) {
      console.warn(
        '[MediaFilesCleaner.cleanUp]: Error occurred while deleting file',
        error,
      );
    }
  };

  return {
    cleanUp,
    cleanUpByStorageKey,
    cleanUpByAnswers,
  };
};

export default createMediaFilesCleaner();
