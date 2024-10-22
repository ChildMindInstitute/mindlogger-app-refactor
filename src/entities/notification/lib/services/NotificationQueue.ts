import { MMKV } from 'react-native-mmkv';

import { INotificationQueue } from './INotificationQueue';
import { NotificationDescriber } from '../types/notificationBuilder';

const storageKey = 'queue';

export function NotificationQueue(
  notificationQueueStorage: MMKV,
): INotificationQueue {
  function get(): NotificationDescriber[] {
    const queue = notificationQueueStorage.getString(storageKey);

    return queue ? (JSON.parse(queue) as NotificationDescriber[]) : [];
  }

  function set(value: NotificationDescriber[]) {
    notificationQueueStorage.set(storageKey, JSON.stringify(value));
  }

  function clear() {
    return notificationQueueStorage.delete(storageKey);
  }

  return {
    get,
    set,
    clear,
  };
}
