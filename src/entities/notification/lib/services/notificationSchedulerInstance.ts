import { NotificationScheduler } from './NotificationScheduler';

let instance: ReturnType<typeof NotificationScheduler>;
export const getDefaultNotificationScheduler = () => {
  if (!instance) {
    instance = NotificationScheduler();
  }
  return instance;
};
