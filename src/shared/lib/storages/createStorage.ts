import { MMKV } from 'react-native-mmkv';

import { AsyncStorage } from './AsyncStorage';
import { registerMMKVStorage } from './ReactotronMMKVTracker';
import { SyncStorage } from './SyncStorage';

export function createSecureStorage(id: string, encryptionKey: string) {
  const storage = new MMKV({ id, encryptionKey });
  registerMMKVStorage(id, storage);
  return storage;
}

export function createStorage(id: string) {
  const storage = new MMKV({ id });
  registerMMKVStorage(id, storage);
  return storage;
}

export function createSyncStorage(id: string) {
  const mmkv = new MMKV({ id });
  registerMMKVStorage(id, mmkv);
  return new SyncStorage(mmkv);
}

export function createAsyncStorage(id: string) {
  const mmkv = new MMKV({ id });
  registerMMKVStorage(id, mmkv);
  return new AsyncStorage(mmkv);
}

export function createSecureAsyncStorage(id: string, encryptionKey: string) {
  const mmkv = new MMKV({ id, encryptionKey });
  registerMMKVStorage(id, mmkv);
  return new AsyncStorage(mmkv);
}
