import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';

import {
  BackgroundTaskOptions,
  IBackgroundWorkerBuilder,
} from './IBackgroundWorkerBuilder';
import { getDefaultLogger } from './loggerInstance';
import { initializeStorageEncryption } from '../storages/mmkvEncryptionKeyManager';

const MINIMUM_ALLOWED_BG_TASK_INTERVAL_MINUTES = 15;

export function BackgroundWorkerBuilder(): IBackgroundWorkerBuilder {
  function setTask(
    callback: () => Promise<unknown>,
    options: BackgroundTaskOptions = {},
  ) {
    const { intervalInMinutes } = options;

    function onTimeout(taskId: string) {
      BackgroundFetch.finish(taskId);
    }

    BackgroundFetch.configure(
      {
        minimumFetchInterval:
          intervalInMinutes ?? MINIMUM_ALLOWED_BG_TASK_INTERVAL_MINUTES,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async taskId => {
        try {
          // Tasks may run before the app UI has booted (e.g. the app was
          // launched in the background), so the MMKV encryption key must be
          // resolved first. This can fail while the device is still locked
          // (the key is only readable after the first unlock) - in that
          // case, skip this run and let the next scheduled background fetch retry.
          await initializeStorageEncryption();

          await Promise.resolve(callback());
        } catch (error) {
          getDefaultLogger().warn(
            `[BackgroundWorkerBuilder.setTask]: Error: ${String(error)}`,
          );
        } finally {
          BackgroundFetch.finish(taskId);
        }
      },
      onTimeout,
    ).catch(console.error);
  }

  function setAndroidHeadlessTask(callback: () => void) {
    async function headlessTask(event: HeadlessEvent) {
      const { taskId, timeout } = event;

      if (timeout) {
        BackgroundFetch.finish(taskId);
        return;
      }

      try {
        // See the comment in setTask above.
        await initializeStorageEncryption();

        await Promise.resolve(callback());
      } catch (error) {
        getDefaultLogger().warn(
          `[BackgroundWorkerBuilder.setAndroidHeadlessTask]: Error: ${String(error)}`,
        );
      } finally {
        BackgroundFetch.finish(taskId);
      }
    }

    BackgroundFetch.registerHeadlessTask(headlessTask);
  }

  return {
    setTask,
    setAndroidHeadlessTask,
  };
}
