import { BackgroundWorkerBuilder } from './BackgroundWorker';

let instance: ReturnType<typeof BackgroundWorkerBuilder>;
export const getDefaultBackgroundWorker = () => {
  if (!instance) {
    instance = BackgroundWorkerBuilder();
  }
  return instance;
};
