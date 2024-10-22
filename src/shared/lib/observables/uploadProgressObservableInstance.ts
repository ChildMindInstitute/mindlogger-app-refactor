import { UploadProgressObservable } from './uploadProgressObservable';

let instance: UploadProgressObservable;
export const getDefaultUploadProgressObservable = () => {
  if (!instance) {
    instance = new UploadProgressObservable();
  }
  return instance;
};
