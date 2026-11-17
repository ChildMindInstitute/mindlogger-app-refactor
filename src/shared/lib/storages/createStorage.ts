import { createMMKV, deleteMMKV } from 'react-native-mmkv';

import { STORAGE_ENCRYPTION_TYPE } from '../constants';
import { AsyncStorage } from './AsyncStorage';
import { registerMMKVStorage } from './ReactotronMMKVTracker';
import { SyncStorage } from './SyncStorage';

// Resolved lazily to avoid a require cycle: loggerInstance -> fileService ->
// systemRecordInstance -> storageInstanceManagerInstance -> this module.
const getLogger = () =>
  (
    require('../services/loggerInstance') as typeof import('../services/loggerInstance')
  ).getDefaultLogger();

function createEncryptedMMKV(
  id: string,
  encryptionKey: string,
  encryptionType?: typeof STORAGE_ENCRYPTION_TYPE,
) {
  try {
    return createMMKV({ id, encryptionKey, encryptionType });
  } catch (error) {
    // The store cannot be opened with the current key (e.g. files restored
    // from a backup made on another device). Data is unrecoverable without
    // the original key, so recreate the store empty instead of crashing.
    getLogger().error(
      `[createSecureStorage] Failed to open encrypted storage "${id}", recreating it: ${String(error)}`,
    );
    deleteMMKV(id);
    return createMMKV({ id, encryptionKey, encryptionType });
  }
}

export function createSecureStorage(
  id: string,
  encryptionKey: string,
  encryptionType?: typeof STORAGE_ENCRYPTION_TYPE,
) {
  const storage = createEncryptedMMKV(id, encryptionKey, encryptionType);
  registerMMKVStorage(id, storage);
  return storage;
}

export function createStorage(id: string) {
  const storage = createMMKV({ id });
  registerMMKVStorage(id, storage);
  return storage;
}

export function createSyncStorage(id: string) {
  const mmkv = createMMKV({ id });
  registerMMKVStorage(id, mmkv);
  return new SyncStorage(mmkv);
}

export function createAsyncStorage(id: string) {
  const mmkv = createMMKV({ id });
  registerMMKVStorage(id, mmkv);
  return new AsyncStorage(mmkv);
}

export function createSecureAsyncStorage(
  id: string,
  encryptionKey: string,
  encryptionType?: typeof STORAGE_ENCRYPTION_TYPE,
) {
  const mmkv = createEncryptedMMKV(id, encryptionKey, encryptionType);
  registerMMKVStorage(id, mmkv);
  return new AsyncStorage(mmkv);
}
