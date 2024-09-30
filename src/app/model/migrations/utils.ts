import { MMKV } from 'react-native-mmkv';

import { STORE_ENCRYPTION_KEY } from '@app/shared/lib/constants';
import { throwError } from '@app/shared/lib/services/errorService';
import {
  createSecureStorage,
  createStorage,
} from '@app/shared/lib/storages/createStorage';

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

const getStoreEncryptionKey = () => {
  if (!STORE_ENCRYPTION_KEY) {
    throwError(
      '[createSecureStorage]: STORE_ENCRYPTION_KEY has not been provided',
    );
  }
  return STORE_ENCRYPTION_KEY as string;
};

export const createMigrationStorage = (storageName: Storages): MMKV => {
  const migrationStorageName = getMigrationStorageName(storageName);
  return SecureStoragesArray.includes(storageName)
    ? createSecureStorage(migrationStorageName, getStoreEncryptionKey())
    : createStorage(migrationStorageName);
};

export const createRegularStorage = (storageName: Storages): MMKV => {
  return SecureStoragesArray.includes(storageName)
    ? createSecureStorage(storageName, getStoreEncryptionKey())
    : createStorage(storageName);
};
