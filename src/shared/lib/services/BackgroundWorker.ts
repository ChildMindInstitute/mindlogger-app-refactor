import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';

const MINIMUM_ALLOWED_BG_TASK_INTERVAL_MINUTES = 15;

export type BackgroundTaskOptions = {
  intervalInMinutes?: number;
};

function BackgroundWorkerBuilder() {
  function setTask(callback: () => void, options: BackgroundTaskOptions = {}) {
    const { intervalInMinutes } = options;

    function onTimeout(taskId: string) {
      console.log('[BackgroundFetch] Failed to start background task');
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
        console.log('[BackgroundWorker] Background job started running');
        await Promise.resolve(callback());
        console.log('[BackgroundWorker] Background job finished');

        BackgroundFetch.finish(taskId);
      },
      onTimeout,
    );
  }

  function setAndroidHeadlessTask(callback: () => void) {
    async function headlessTask(event: HeadlessEvent) {
      console.log('[BackgroundWorker] Background headless job started running');

      const { taskId, timeout } = event;

      if (timeout) {
        BackgroundFetch.finish(taskId);
        return;
      }

      await Promise.resolve(callback());

      console.log('[BackgroundWorker] Background headless job finished');
      BackgroundFetch.finish(taskId);
    }

    BackgroundFetch.registerHeadlessTask(headlessTask);
  }

  return {
    setTask,
    setAndroidHeadlessTask,
  };
}

export const BackgroundWorker = BackgroundWorkerBuilder();
