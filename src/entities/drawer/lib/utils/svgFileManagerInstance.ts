import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { SvgFileManager } from './SvgFileManager';

let instance: SvgFileManager;
export const getDefaultSvgFileManager = () => {
  if (!instance) {
    instance = new SvgFileManager(getDefaultLogger());
  }
  return instance;
};
