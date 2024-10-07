import { ChangeQueueObservable } from './changeQueueObservable';

let instance: ChangeQueueObservable;
export const getDefaultChangeQueueObservable = () => {
  if (!instance) {
    instance = new ChangeQueueObservable();
  }
  return instance;
};
