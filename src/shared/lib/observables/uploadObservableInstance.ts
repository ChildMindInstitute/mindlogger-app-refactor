import { UploadObservable } from './uploadObservable';

let instance: UploadObservable;
export const getDefaultUploadObservable = () => {
  if (!instance) {
    instance = new UploadObservable();
  }
  return instance;
};
