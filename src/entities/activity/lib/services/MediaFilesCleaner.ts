import { FileSystem } from 'react-native-file-access';

import { ActivityRecordKeyParams } from '@app/abstract/lib';
import { AnswerDto, ObjectAnswerDto } from '@app/shared/api';
import { createSecureStorage, Logger } from '@app/shared/lib';
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
  const promisedCleanUpByStorageKey = async (key: string) => {
    const storageActivityState = activityStorage.getString(key);

    if (!storageActivityState) {
      Logger.warn("[MediaFilesCleaner.cleanUp]: Activity record doesn't exist");
      return;
    }

    const entityRecord = JSON.parse(storageActivityState) as EntityRecord;

    const urlsToProcess: string[] = [];

    for (const recordId in entityRecord.answers) {
      const record = entityRecord.answers[recordId]?.answer;

      if (record?.uri) {
        urlsToProcess.push(record.uri);
      }
    }

    for (const fileUrl of urlsToProcess) {
      try {
        const fileExists = await FileSystem.exists(fileUrl);

        if (fileExists) {
          await FileSystem.unlink(fileUrl);
        }
      } catch (error) {
        Logger.warn(
          '[MediaFilesCleaner.cleanUp]: Error occurred while deleting file',
        );
      }
    }

    Logger.info('[MediaFilesCleaner.cleanUp]: completed');
  };

  const promisedCleanUp = async ({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  }: ActivityRecordKeyParams) => {
    const key = `${appletId}-${activityId}-${eventId}-${targetSubjectId || 'NULL'}-${order}`;

    return promisedCleanUpByStorageKey(key);
  };

  const promisedCleanUpByAnswers = async (answers: AnswerDto[]) => {
    try {
      const nonNilAnswers = answers.filter(Boolean);
      for (const answer of nonNilAnswers) {
        const { value: answerValue } = answer as ObjectAnswerDto;

        const mediaValue = answerValue as MediaValue;

        if (mediaValue?.uri) {
          const fileExists = await FileSystem.exists(mediaValue.uri);

          if (fileExists) {
            await FileSystem.unlink(mediaValue.uri);

            console.info('[MediaFilesCleaner.cleanUp]: completed');
          }
        }
      }
    } catch (error) {
      console.warn(
        '[MediaFilesCleaner.cleanUp]: Error occurred while deleting file',
        error,
      );
    }
  };

  const cleanUp = (param: ActivityRecordKeyParams) => {
    promisedCleanUp(param).catch(console.error);
  };

  const cleanUpByStorageKey = (key: string) => {
    promisedCleanUpByStorageKey(key).catch(console.error);
  };

  const cleanUpByAnswers = (answers: AnswerDto[]) => {
    promisedCleanUpByAnswers(answers).catch(console.error);
  };

  return {
    cleanUp,
    cleanUpByStorageKey,
    cleanUpByAnswers,
  };
};

export default createMediaFilesCleaner();
