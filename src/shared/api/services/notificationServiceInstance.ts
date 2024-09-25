import { notificationService } from './notificationService';

let instance: ReturnType<typeof notificationService>;
export const getDefaultNotificationService = () => {
  if (!instance) {
    instance = notificationService();
  }
  return instance;
};
