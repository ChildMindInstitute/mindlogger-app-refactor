import { IS_ANDROID, IS_IOS, Logger } from '@app/shared/lib';

import { ActivityState, PipelineItem } from './MigrationStorageTypes0002';
import {
  getActivityState,
  getActivityStorageKeys,
  renameMediaFile,
  moveMediaFileToCache,
  updateActivityState,
  isMediaItem,
} from './MigrationUtils0002';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

export class MigrationToVersion0002 implements IMigration {
  private evaluateMediaItemSteps(
    activityItems: Array<PipelineItem>,
  ): Array<string> {
    const mediaItemSteps = activityItems.reduce<Array<string>>(
      (result, item, step) => {
        if (isMediaItem(item)) {
          result.push(step.toString());
        }

        return result;
      },
      [],
    );

    return mediaItemSteps;
  }

  private async getUpdatedActivityState(
    activityFrom: ActivityState,
  ): Promise<ActivityState> {
    const mediaItemSteps = this.evaluateMediaItemSteps(activityFrom.items);

    for await (const step of mediaItemSteps) {
      const mediaFile = activityFrom.answers[step]?.answer;
      const hasAnswer = !!mediaFile?.fileName;

      if (!hasAnswer) {
        continue;
      }

      /**
       * For iOS, it is required to moved files from /tmp/ folder (created by react-native-image-picker).
       * For Android, files' fileName property be renamed because react-native-image-picker assigns them wrong names.
       */
      if (IS_IOS) {
        await moveMediaFileToCache(mediaFile.fileName, mediaFile.uri);
      } else {
        renameMediaFile(mediaFile);
      }
    }

    for (const action of activityFrom.actions) {
      /**
       * In user actions, we should only change the fileName and there is no need
       * to move the file because the file might have been already deleted.
       */
      const shouldRenameMediaFile =
        IS_ANDROID &&
        action.type === 'SET_ANSWER' &&
        isMediaItem(action.payload.answer);

      if (shouldRenameMediaFile) {
        renameMediaFile(action.payload.answer.value.answer!);
      }
    }

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
        const updatedActivityState = await this.getUpdatedActivityState(
          activityState,
        );

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
