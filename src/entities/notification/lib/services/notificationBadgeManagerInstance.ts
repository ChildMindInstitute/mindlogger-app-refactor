import { NotificationBadgeManager } from './NotificationBadgeManager';

let instance: NotificationBadgeManager;
export const getDefaultNotificationBadgeManager = () => {
  if (!instance) {
    instance = new NotificationBadgeManager();
  }
  return instance;
};
