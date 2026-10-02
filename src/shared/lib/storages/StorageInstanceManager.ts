import { MMKV } from 'react-native-mmkv';

import { SYSTEM_STORAGE_ID } from '../constants';
import { createStorage, createSecureStorage } from './createStorage';
import { IStorageInstanceManager } from './IStorageInstanceManager';
import { getStorageEncryptionConfigSync } from './mmkvEncryptionKeyManager';

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
  public getMfaTokenStorage: () => MMKV;

  constructor() {
    this.instances = {};
    this.securedInstances = {};

    this.getSystemStorage = this.getter(SYSTEM_STORAGE_ID);
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
    this.getMfaTokenStorage = this.securedGetter('mfa-token-storage');
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
    const getter = (): MMKV => {
      if (!this.securedInstances[storageName]) {
        // Resolved lazily at first storage access: the per-device key is
        // fetched asynchronously from the keychain during app bootstrap
        // (see initializeStorageEncryption), before any secured storage
        // consumer runs.
        const { encryptionKey, encryptionType } =
          getStorageEncryptionConfigSync();

        this.securedInstances[storageName] = createSecureStorage(
          storageName,
          encryptionKey,
          encryptionType,
        );
      }
      return this.securedInstances[storageName] as MMKV;
    };

    return getter.bind(this);
  }
}
