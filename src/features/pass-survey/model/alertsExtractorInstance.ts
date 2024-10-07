import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { AlertsExtractor } from './AlertsExtractor';

let instance: AlertsExtractor;
export const getDefaultAlertsExtractor = () => {
  if (!instance) {
    instance = new AlertsExtractor(getDefaultLogger());
  }
  return instance;
};
