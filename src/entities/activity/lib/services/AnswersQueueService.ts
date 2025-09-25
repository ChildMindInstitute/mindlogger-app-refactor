import { MMKV } from 'react-native-mmkv';

import {
  IAnswersQueueService,
  UploadItem,
} from '@entities/activity/lib/services/IAnswersQueueService';
import { IObservable } from '@shared/lib/utils/IObservable';

const StartKey = '1';

export class AnswersQueueService implements IAnswersQueueService {
  private uploadQueueStorage: MMKV;

  constructor(changeObservable: IObservable, uploadQueueStorage: MMKV) {
    this.uploadQueueStorage = uploadQueueStorage;

    this.uploadQueueStorage.addOnValueChangedListener(() => {
      changeObservable.notify();
    });
  }

  private getKeys(): number[] {
    return this.uploadQueueStorage.getAllKeys().map(x => Number(x));
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

    return JSON.parse(this.uploadQueueStorage.getString(key)!) as UploadItem;
  }

  public enqueue(item: UploadItem): void {
    const lastKey = this.getMaximumKeyValue();
    const key = lastKey !== null ? String(lastKey + 1) : StartKey;

    this.uploadQueueStorage.set(key, JSON.stringify(item));
  }

  public dequeue(): void {
    const firstKey = this.getMinimumKeyValue();
    if (firstKey === null) {
      return;
    }

    this.uploadQueueStorage.delete(String(firstKey));
  }

  public swap() {
    const firstKey = this.getMinimumKeyValue();
    const lastKey = this.getMaximumKeyValue();

    if (firstKey === null || lastKey === null || firstKey === lastKey) {
      return;
    }

    const firstItem: string = this.uploadQueueStorage.getString(
      String(firstKey),
    )!;

    const lastItem: string = this.uploadQueueStorage.getString(
      String(lastKey),
    )!;

    this.uploadQueueStorage.set(String(firstKey), lastItem);
    this.uploadQueueStorage.set(String(lastKey), firstItem);
  }

  public getLength(): number {
    return this.getKeys().length;
  }

  public getAllItems(): UploadItem[] {
    const keys = this.getKeys();
    const items: UploadItem[] = [];
    
    for (const key of keys) {
      const json = this.uploadQueueStorage.getString(String(key));
      if (json) {
        items.push(JSON.parse(json) as UploadItem);
      }
    }
    
    return items;
  }

  public hasOtherPendingFlowActivities(
    submitId: string, 
    currentActivityId: string,
    flowId: string
  ): boolean {
    const allItems = this.getAllItems();
    
    return allItems.some(item => 
      item.input.submitId === submitId &&
      item.input.flowId === flowId &&
      item.input.activityId !== currentActivityId
    );
  }
}
