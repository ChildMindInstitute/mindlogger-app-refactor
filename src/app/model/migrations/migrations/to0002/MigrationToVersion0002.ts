import { IS_ANDROID, IS_IOS, Logger } from '@app/shared/lib';

import {
  ActivityState,
  PipelineItem,
  UserAction,
} from './MigrationStorageTypes0002';
import {
  getActivityState,
  getActivityStorageKeys,
  renameMediaFile,
  moveMediaFileToCache,
  updateActivityState,
  isVideoOrPhotoItem,
  isAudioItem,
} from './MigrationUtils0002';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

export class MigrationToVersion0002 implements IMigration {
  private evaluateVideoPhotoItemSteps(
    activityItems: Array<PipelineItem>,
  ): Array<string> {
    const mediaItemSteps = activityItems.reduce<Array<string>>(
      (result, item, step) => {
        if (isVideoOrPhotoItem(item)) {
          result.push(step.toString());
        }

        return result;
      },
      [],
    );

    return mediaItemSteps;
  }

  private evaluateAudioItemSteps(
    activityItems: Array<PipelineItem>,
  ): Array<string> {
    const mediaItemSteps = activityItems.reduce<Array<string>>(
      (result, item, step) => {
        if (isAudioItem(item)) {
          result.push(step.toString());
        }

        return result;
      },
      [],
    );

    return mediaItemSteps;
  }

  private async processVideoPhotoItems(activityFrom: ActivityState) {
    const videoPhotoItemSteps = this.evaluateVideoPhotoItemSteps(
      activityFrom.items,
    );

    for await (const step of videoPhotoItemSteps) {
      const mediaFile = activityFrom.answers[step]?.answer;
      const hasAnswer = !!mediaFile?.fileName;

      if (!hasAnswer) {
        continue;
      }

      if (mediaFile.uri) {
        if (IS_IOS) {
          /**
           * For iOS, it is required to moved files from /tmp/ folder (created by react-native-image-picker).
           * For Android, files' fileName property be renamed because react-native-image-picker assigns them wrong names.
           */
          const cacheFileUri = await moveMediaFileToCache(
            mediaFile.fileName,
            mediaFile.uri,
          );

          Logger.info(
            `[MigrationToVersion0002]: File ${mediaFile.fileName} has been moved from ${mediaFile.uri} to ${cacheFileUri}`,
          );
        } else {
          const originalName = mediaFile.fileName;

          renameMediaFile(mediaFile);

          if (originalName !== mediaFile.fileName) {
            Logger.info(
              `[MigrationToVersion0002]: Media file ${originalName} has been renamed to ${mediaFile.fileName}`,
            );
          }
        }
      }
    }
  }

  private processAudioFiles(activityFrom: ActivityState) {
    const audioItemSteps = this.evaluateAudioItemSteps(activityFrom.items);

    for (const step of audioItemSteps) {
      const audioFile = activityFrom.answers[step]?.answer;
      const hasAnswer = !!audioFile?.fileName;

      if (!hasAnswer) {
        continue;
      }

      const originalName = audioFile.fileName;

      renameMediaFile(audioFile);

      if (originalName !== audioFile.fileName) {
        Logger.info(
          `[MigrationToVersion0002]: Audio file ${originalName} has been renamed to ${audioFile.fileName}`,
        );
      }
    }
  }

  private processUserActions(userActions: Array<UserAction>) {
    for (const action of userActions) {
      /**
       * In user actions, we should only change the fileName and there is no need
       * to move the file because the file might have been already deleted.
       */
      const shouldRenamePhotoVideo =
        IS_ANDROID &&
        action.type === 'SET_ANSWER' &&
        isVideoOrPhotoItem(action.payload.answer);

      const shouldRenameAudio =
        action.type === 'SET_ANSWER' && isAudioItem(action.payload.answer);

      const shouldRenameMediaFile = shouldRenamePhotoVideo || shouldRenameAudio;

      if (shouldRenameMediaFile) {
        const answerValue = action.payload.answer.value.answer!;
        const originalName = answerValue.fileName;

        renameMediaFile(answerValue);

        if (originalName !== answerValue.fileName) {
          Logger.info(
            `[MigrationToVersion0002]: Filename ${originalName} in user actions has been renamed to ${answerValue.fileName}`,
          );
        }
      }
    }
  }

  private async getUpdatedActivityState(
    activityFrom: ActivityState,
  ): Promise<ActivityState> {
    await Promise.all([
      this.processVideoPhotoItems(activityFrom),
      this.processAudioFiles(activityFrom),
      this.processUserActions(activityFrom.actions),
    ]);

    return activityFrom;
  }

  async migrate(input: MigrationInput): Promise<MigrationOutput> {
    // We don't need to change Redux State in this migration
    const result = { ...input };

    const activityStorageKeys = getActivityStorageKeys();

    for await (const storageKey of activityStorageKeys) {
      const activityState = getActivityState(storageKey);

      if (!activityState) {
        Logger.warn(
          `[MigrationToVersion0002.migrate]: Activity record ${storageKey} does not exist`,
        );
        continue;
      }

      try {
        const updatedActivityState =
          await this.getUpdatedActivityState(activityState);

        updateActivityState(storageKey, updatedActivityState);
      } catch (error) {
        Logger.error(
          `[MigrationToVersion0002.migrate] Migration failed to execute for the activity record ${storageKey} due to the error:
          ${error}`,
        );
      }
    }

    return result;
  }
}

export default MigrationToVersion0002;
