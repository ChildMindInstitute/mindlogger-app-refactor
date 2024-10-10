import { MMKV } from 'react-native-mmkv';

import { AsyncStorage } from './AsyncStorage';
import { SyncStorage } from './SyncStorage';

export function createSecureStorage(id: string, encryptionKey: string) {
  return new MMKV({ id, encryptionKey });
}

export function createStorage(id: string) {
  return new MMKV({ id });
}

export function createSyncStorage(id: string) {
  return new SyncStorage(new MMKV({ id }));
}

export function createAsyncStorage(id: string) {
  return new AsyncStorage(new MMKV({ id }));
}

export function createSecureAsyncStorage(id: string, encryptionKey: string) {
  return new AsyncStorage(new MMKV({ id, encryptionKey }));
}
