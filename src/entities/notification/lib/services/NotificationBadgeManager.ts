import notifee from '@notifee/react-native';

class NotificationBadgeManager {
  get count() {
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

export default new NotificationBadgeManager();
