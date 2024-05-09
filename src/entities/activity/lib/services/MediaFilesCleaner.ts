import { FileSystem } from 'react-native-file-access';

import { ActivityRecordKeyParams } from '@app/abstract/lib';
import { AnswerDto, ObjectAnswerDto } from '@app/shared/api';
import {
  createSecureStorage,
  evaluateFileCacheUri,
  Logger,
} from '@app/shared/lib';
import { MediaFile, MediaValue } from '@app/shared/ui';

type EntityRecord = {
  answers: Record<string, { answer: MediaFile } | undefined>;
};

export const activityStorage = createSecureStorage('activity_progress-storage');

type Result = {
  cleanUp: (keyParams: ActivityRecordKeyParams) => Promise<void>;
  cleanUpByStorageKey: (key: string) => Promise<void>;
  cleanUpByAnswers: (answers: AnswerDto[]) => Promise<void>;
};

const createMediaFilesCleaner = (): Result => {
  const cleanUpByStorageKey = async (key: string) => {
    const storageActivityState = activityStorage.getString(key);

    if (!storageActivityState) {
      Logger.warn("[MediaFilesCleaner.cleanUp]: Activity record doesn't exist");
      return;
    }

    const entityRecord = JSON.parse(storageActivityState) as EntityRecord;

    const urlsToProcess: string[] = [];

    for (const recordId in entityRecord.answers) {
      const record = entityRecord.answers[recordId]?.answer;

      if (record?.fileName) {
        const fileUri = evaluateFileCacheUri(record.fileName);

        urlsToProcess.push(fileUri);
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
    for await (const answer of answers) {
      try {
        const { value: answerValue } = answer as ObjectAnswerDto;

        const mediaValue = answerValue as MediaValue;

        if (mediaValue?.fileName) {
          const fileUri = evaluateFileCacheUri(mediaValue.fileName);
          const fileExists = await FileSystem.exists(fileUri);

          if (fileExists) {
            await FileSystem.unlink(fileUri);

            Logger.info('[MediaFilesCleaner.cleanUp]: completed');
          }
        }
      } catch (error) {
        Logger.warn(
          `[MediaFilesCleaner.cleanUp]: Error occurred while deleting the file from answer:
          ${JSON.stringify(answer, null, 2)}

          Error: ${error as string}`,
        );
      }
    }
  };

  return {
    cleanUp,
    cleanUpByStorageKey,
    cleanUpByAnswers,
  };
};

export default createMediaFilesCleaner();
