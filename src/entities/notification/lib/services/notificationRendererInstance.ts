import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { NotificationRenderer } from './NotificationRenderer';

let instance: ReturnType<typeof NotificationRenderer>;
export const getDefaultNotificationRenderer = () => {
  if (!instance) {
    instance = NotificationRenderer(getDefaultLogger());
  }
  return instance;
};
