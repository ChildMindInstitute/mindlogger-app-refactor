import notifee from 'react-native-notify-kit';

import { INotificationBadgeManager } from './INotificationBadgeManager';

export class NotificationBadgeManager implements INotificationBadgeManager {
  getCount() {
    return notifee.getBadgeCount();
  }

  increment(): Promise<void> {
    return notifee.incrementBadgeCount();
  }

  decrement(): Promise<void> {
    return notifee.decrementBadgeCount();
  }

  setCount(value: number): Promise<void> {
    return notifee.setBadgeCount(value);
  }

  clear(): Promise<void> {
    return this.setCount(0);
  }
}
