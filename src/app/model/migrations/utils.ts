import { MMKV } from 'react-native-mmkv';

import {
  createSecureStorage,
  createStorage,
} from '@app/shared/lib/storages/createStorage';
import { getStorageEncryptionConfigSync } from '@app/shared/lib/storages/mmkvEncryptionKeyManager';

import { MigrationPrefix, SecureStoragesArray, Storages } from './types';

export const getStorageRecord = <T>(
  storageName: Storages,
  key: string,
): T | null => {
  const migrationStorage = createMigrationStorage(storageName);
  const regularStorage = createRegularStorage(storageName);

  const json = migrationStorage.getString(key) ?? regularStorage.getString(key);

  if (json) {
    return JSON.parse(json) as T;
  } else {
    return null;
  }
};

export const upsertStorageRecord = <T>(
  storageName: Storages,
  key: string,
  item: T,
) => {
  const migrationStorage = createMigrationStorage(storageName);
  migrationStorage.set(key, JSON.stringify(item));
};

export const getMigrationStorageName = (storage: Storages): string => {
  return `${MigrationPrefix}--${storage}`;
};

const createSecureStorageWithDeviceKey = (storageName: string): MMKV => {
  const { encryptionKey, encryptionType } = getStorageEncryptionConfigSync();
  return createSecureStorage(storageName, encryptionKey, encryptionType);
};

export const createMigrationStorage = (storageName: Storages): MMKV => {
  const migrationStorageName = getMigrationStorageName(storageName);
  return SecureStoragesArray.includes(storageName)
    ? createSecureStorageWithDeviceKey(migrationStorageName)
    : createStorage(migrationStorageName);
};

export const createRegularStorage = (storageName: Storages): MMKV => {
  return SecureStoragesArray.includes(storageName)
    ? createSecureStorageWithDeviceKey(storageName)
    : createStorage(storageName);
};
