import { AppletNotificationDescribers } from '../../lib/types/notificationBuilder';

export interface INotificationBuilder {
  build: () => AppletNotificationDescribers;
}
