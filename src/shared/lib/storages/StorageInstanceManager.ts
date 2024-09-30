import { MMKV } from 'react-native-mmkv';

import { createStorage, createSecureStorage } from './createStorage';
import { IStorageInstanceManager } from './IStorageInstanceManager';
import { STORE_ENCRYPTION_KEY } from '../constants';
import { throwError } from '../services/errorService';

export class StorageInstanceManager implements IStorageInstanceManager {
  private instances: Record<string, MMKV | null | undefined>;
  private securedInstances: Record<string, MMKV | null | undefined>;

  public getSystemStorage: () => MMKV;
  public getAnalyticsStorage: () => MMKV;
  public getLocalizationStorage: () => MMKV;
  public getNotificationQueueStorage: () => MMKV;
  public getFlowProgressStorage: () => MMKV;

  public getNavigationStorage: () => MMKV;
  public getSessionStorage: () => MMKV;
  public getUploadQueueStorage: () => MMKV;
  public getActivityProgressStorage: () => MMKV;
  public getUserInfoStorage: () => MMKV;
  public getUserPrivateKeyStorage: () => MMKV;

  constructor() {
    this.instances = {};
    this.securedInstances = {};

    this.getSystemStorage = this.getter('system');
    this.getAnalyticsStorage = this.getter('analytics-storage');
    this.getLocalizationStorage = this.getter('localization');
    this.getNotificationQueueStorage = this.getter('notification-queue');
    this.getFlowProgressStorage = this.getter('flow_progress-storage');

    this.getNavigationStorage = this.securedGetter('navigation-storage');
    this.getSessionStorage = this.securedGetter('session-storage');
    this.getUploadQueueStorage = this.securedGetter('upload_queue-storage');
    this.getActivityProgressStorage = this.securedGetter(
      'activity_progress-storage',
    );
    this.getUserInfoStorage = this.securedGetter('user-info');
    this.getUserPrivateKeyStorage = this.securedGetter('user-private-key');
  }

  private getter(storageName: string) {
    const getter = (): MMKV => {
      if (!this.instances[storageName]) {
        this.instances[storageName] = createStorage(storageName);
      }
      return this.instances[storageName] as MMKV;
    };

    return getter.bind(this);
  }

  private securedGetter(storageName: string) {
    const storeEncryptionKey = this.getStoreEncryptionKey();

    if (!storeEncryptionKey) {
      throwError(
        '[createSecureStorage]: STORE_ENCRYPTION_KEY has not been provided',
      );
    }

    const getter = (): MMKV => {
      if (!this.securedInstances[storageName]) {
        this.securedInstances[storageName] = createSecureStorage(
          storageName,
          storeEncryptionKey as string,
        );
      }
      return this.securedInstances[storageName] as MMKV;
    };

    return getter.bind(this);
  }

  private getStoreEncryptionKey(): string | undefined {
    return STORE_ENCRYPTION_KEY;
  }
}
