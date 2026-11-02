import { getDefaultFileService } from '@app/shared/api/services/fileServiceInstance';

import { LoggerWithUpload } from './Logger';

let instance: LoggerWithUpload;
export const getDefaultLogger = () => {
  if (!instance) {
    instance = new LoggerWithUpload(getDefaultFileService());
  }
  return instance;
};
