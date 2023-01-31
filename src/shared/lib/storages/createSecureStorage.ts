import { MMKV } from 'react-native-mmkv';

import { STORE_ENCRYPTION_KEY } from '../constants';

function createSecureStorage(id: string) {
  return new MMKV({ id, encryptionKey: STORE_ENCRYPTION_KEY });
}

export default createSecureStorage;
