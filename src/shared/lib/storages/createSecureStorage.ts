import { MMKV } from 'react-native-mmkv';

import { STORE_ENCRYPTION_KEY } from '../constants';
import { throwError } from '../services';

function createSecureStorage(id: string) {
  if (!STORE_ENCRYPTION_KEY) {
    throwError(
      '[createSecureStorage]: STORE_ENCRYPTION_KEY has not been provided',
    );
  }

  return new MMKV({ id, encryptionKey: STORE_ENCRYPTION_KEY });
}

export default createSecureStorage;
