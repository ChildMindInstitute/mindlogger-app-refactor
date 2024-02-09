import { MMKV } from 'react-native-mmkv';

import AsyncStorage from './AsyncStorage';
import SyncStorage from './SyncStorage';
import { STORE_ENCRYPTION_KEY } from '../constants';
import { throwError } from '../services';

export function createSecureStorage(id: string) {
  if (!STORE_ENCRYPTION_KEY) {
    throwError('[createSecureStorage]: STORE_ENCRYPTION_KEY has not been provided');
  }

  return new MMKV({ id, encryptionKey: STORE_ENCRYPTION_KEY });
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

export function createSecureAsyncStorage(id: string) {
  if (!STORE_ENCRYPTION_KEY) {
    throwError('[createSecureAsyncStorage]: STORE_ENCRYPTION_KEY has not been provided');
  }

  return new AsyncStorage(new MMKV({ id, encryptionKey: STORE_ENCRYPTION_KEY }));
}
