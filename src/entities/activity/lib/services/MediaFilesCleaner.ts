import { FileSystem } from 'react-native-file-access';
import { MMKV } from 'react-native-mmkv';

import { ActivityRecordKeyParams } from '@app/abstract/lib/types/storage';
import {
  AnswerDto,
  ObjectAnswerDto,
} from '@app/shared/api/services/IAnswerService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { MediaFile, MediaValue } from '@app/shared/ui/survey/MediaItems/types';
import { getActivityRecordKey } from '@app/widgets/survey/lib/storageHelpers';

import { IMediaFilesCleaner } from './IMediaFilesCleaner';

type EntityRecord = {
  answers: Record<string, { answer: MediaFile } | undefined>;
};

export const createMediaFilesCleaner = (
  activityProgressStorage: MMKV,
): IMediaFilesCleaner => {
  const promisedCleanUpByStorageKey = async (key: string) => {
    const storageActivityState = activityProgressStorage.getString(key);

    if (!storageActivityState) {
      getDefaultLogger().warn(
        "[MediaFilesCleaner.cleanUp]: Activity record doesn't exist",
      );
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
        getDefaultLogger().warn(
          '[MediaFilesCleaner.cleanUp]: Error occurred while deleting file',
        );
      }
    }

    getDefaultLogger().info('[MediaFilesCleaner.cleanUp]: completed');
  };

  const promisedCleanUp = async ({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  }: ActivityRecordKeyParams) => {
    const key = getActivityRecordKey(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    );

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
