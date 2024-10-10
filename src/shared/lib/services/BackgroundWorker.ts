import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';

import {
  BackgroundTaskOptions,
  IBackgroundWorkerBuilder,
} from './IBackgroundWorkerBuilder';

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
        await Promise.resolve(callback());

        BackgroundFetch.finish(taskId);
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

      await Promise.resolve(callback());

      BackgroundFetch.finish(taskId);
    }

    BackgroundFetch.registerHeadlessTask(headlessTask);
  }

  return {
    setTask,
    setAndroidHeadlessTask,
  };
}
