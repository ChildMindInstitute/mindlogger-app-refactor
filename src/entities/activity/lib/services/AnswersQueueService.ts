import { createSecureStorage } from '@app/shared/lib';

import { ChangeQueueObservable } from '../observables';
import { IChangeQueueNotify } from '../observables/changeQueueObservable';
import { SendAnswersInput } from '../types';

type UploadItem = {
  input: SendAnswersInput;
};

export interface IAnswersQueueService {
  pick: () => UploadItem | null;
  enqueue: (item: UploadItem) => void;
  dequeue: () => void;
  swap: () => void;
  removeListener: () => void;
  getLength: () => number;
}

const storage = createSecureStorage('upload_queue-storage');

const StartKey = '1';

class AnswersQueueService implements IAnswersQueueService {
  constructor(changeObservable: IChangeQueueNotify) {
    const listener = storage.addOnValueChangedListener(() => {
      changeObservable.notify(this.getLength() > 0);
    });
    this.removeListener = listener.remove;
  }

  public removeListener: () => void;

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

    const firstItem = JSON.parse(
      storage.getString(String(firstKey))!,
    ) as UploadItem;

    const lastItem = JSON.parse(
      storage.getString(String(lastKey))!,
    ) as UploadItem;

    storage.set(String(firstKey), JSON.stringify(lastItem));
    storage.set(String(lastKey), JSON.stringify(firstItem));
  }

  public getLength(): number {
    return this.getKeys().length;
  }
}

export default new AnswersQueueService(ChangeQueueObservable);
