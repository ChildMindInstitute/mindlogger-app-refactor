import { getDefaultFileService } from '@app/shared/api/services/fileServiceInstance';

import { Logger } from './Logger';

let instance: Logger;
export const getDefaultLogger = () => {
  if (!instance) {
    instance = new Logger(getDefaultFileService());
  }
  return instance;
};
