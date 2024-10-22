export type BackgroundTaskOptions = {
  intervalInMinutes?: number;
};

export type IBackgroundWorkerBuilder = {
  setTask: (
    callback: () => Promise<unknown>,
    options?: BackgroundTaskOptions,
  ) => void;
  setAndroidHeadlessTask: (callback: () => void) => void;
};
