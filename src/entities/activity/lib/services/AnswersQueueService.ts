import {
  ChangeQueueObservable,
  IObservable,
  createSecureStorage,
} from '@app/shared/lib';

import { SendAnswersInput } from '../types';

type UploadItem = {
  input: SendAnswersInput;
};

export interface IAnswersQueueService {
  pick: () => UploadItem | null;
  enqueue: (item: UploadItem) => void;
  dequeue: () => void;
  swap: () => void;
  getLength: () => number;
}

const storage = createSecureStorage('upload_queue-storage');

const StartKey = '1';

class AnswersQueueService implements IAnswersQueueService {
  constructor(changeObservable: IObservable) {
    storage.addOnValueChangedListener(() => {
      changeObservable.notify();
    });
  }

  private getKeys(): number[] {
    return storage.getAllKeys().map(x => Number(x));
  }

  private getMinimumKeyValue(): number | null {
    const keys = this.getKeys();
    if (!keys.length) {
      return null;
    }
    return Math.min(...keys);
  }

  private getMaximumKeyValue(): number | null {
    const keys = this.getKeys();
    if (!keys.length) {
      return null;
    }
    return Math.max(...keys);
  }

  public pick(): UploadItem | null {
    const firstKey = this.getMinimumKeyValue();
    if (firstKey === null) {
      return null;
    }

    const key = String(firstKey);

    return JSON.parse(storage.getString(key)!) as UploadItem;
  }

  public enqueue(item: UploadItem): void {
    const lastKey = this.getMaximumKeyValue();
    const key = lastKey !== null ? String(lastKey + 1) : StartKey;

    storage.set(key, JSON.stringify(item));
  }

  public dequeue(): void {
    const firstKey = this.getMinimumKeyValue();
    if (firstKey === null) {
      return;
    }

    storage.delete(String(firstKey));
  }

  public swap() {
    const firstKey = this.getMinimumKeyValue();
    const lastKey = this.getMaximumKeyValue();

    if (firstKey === null || lastKey === null || firstKey === lastKey) {
      return;
    }

    const firstItem: string = storage.getString(String(firstKey))!;

    const lastItem: string = storage.getString(String(lastKey))!;

    storage.set(String(firstKey), lastItem);
    storage.set(String(lastKey), firstItem);
  }

  public getLength(): number {
    return this.getKeys().length;
  }
}

export default new AnswersQueueService(ChangeQueueObservable);
