import { createStorage } from '@app/shared/lib';

import { NotificationDescriber } from '../types';

const storage = createStorage('notification-queue');

const storageKey = 'queue';

function NotificationQueue() {
  function get(): NotificationDescriber[] {
    const queue = storage.getString(storageKey);

    return queue ? (JSON.parse(queue) as NotificationDescriber[]) : [];
  }

  function set(value: NotificationDescriber[]) {
    storage.set(storageKey, JSON.stringify(value));
  }

  function clear() {
    return storage.delete(storageKey);
  }

  return {
    get,
    set,
    clear,
  };
}

export default NotificationQueue();
