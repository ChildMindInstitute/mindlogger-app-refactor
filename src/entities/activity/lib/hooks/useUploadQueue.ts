import { useMMKVListener } from 'react-native-mmkv';

import { createSecureStorage } from '@app/shared/lib';

import { SendAnswersInput } from '../types';

type UploadItem = {
  input: SendAnswersInput;
};

type Result = {
  pick: () => UploadItem | null;
  enqueue: (item: UploadItem) => void;
  dequeue: () => void;
  swap: () => void;
};

type UseQueueInput = {
  onChange: () => void;
};

const storage = createSecureStorage('upload_queue-storage');

const StartKey = '1';

export function useUploadQueue({ onChange }: UseQueueInput): Result {
  useMMKVListener(() => {
    onChange();
  }, storage);

  const getKeys = () => {
    return storage.getAllKeys().map(x => Number(x));
  };

  const getMinimumKeyValue = (): number | null => {
    const keys = getKeys();
    if (!keys.length) {
      return null;
    }
    return Math.min(...keys);
  };

  const getMaximumKeyValue = (): number | null => {
    const keys = getKeys();
    if (!keys.length) {
      return null;
    }
    return Math.max(...keys);
  };

  const pick = (): UploadItem | null => {
    const firstKey = getMinimumKeyValue();
    if (firstKey === null) {
      return null;
    }

    const key = String(firstKey);

    return JSON.parse(storage.getString(key)!) as UploadItem;
  };

  const enqueue = (item: UploadItem): void => {
    const lastKey = getMaximumKeyValue();
    const key = lastKey !== null ? String(lastKey + 1) : StartKey;

    storage.set(key, JSON.stringify(item));
  };

  const dequeue = (): void => {
    const firstKey = getMinimumKeyValue();
    if (firstKey === null) {
      return;
    }

    storage.delete(String(firstKey));
  };

  const swap = () => {
    const firstKey = getMinimumKeyValue();
    const lastKey = getMaximumKeyValue();

    if (firstKey === null || lastKey === null || firstKey === lastKey) {
      return;
    }

    const firstItem = JSON.parse(
      storage.getString(String(firstKey))!,
    ) as UploadItem;

    const lastItem = JSON.parse(
      storage.getString(String(lastKey))!,
    ) as UploadItem;

    storage.set(String(firstKey), JSON.stringify(lastItem));
    storage.set(String(lastKey), JSON.stringify(firstItem));
  };

  return {
    pick,
    enqueue,
    dequeue,
    swap,
  };
}
