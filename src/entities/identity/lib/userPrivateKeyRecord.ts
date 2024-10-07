import { MMKV } from 'react-native-mmkv';

import { IUserPrivateKeyRecord, PrivateKey } from './IUserPrivateKeyRecord';

const storeKey = 'private-key';

export function UserPrivateKeyRecord(
  userPrivateKeyStorage: MMKV,
): IUserPrivateKeyRecord {
  function get(): PrivateKey | undefined {
    const value = userPrivateKeyStorage.getString(storeKey);

    if (value) {
      return JSON.parse(value);
    }
  }

  function set(privateKey: PrivateKey) {
    userPrivateKeyStorage.set(storeKey, JSON.stringify(privateKey));
  }

  function clear() {
    return userPrivateKeyStorage.delete(storeKey);
  }

  return {
    get,
    set,
    clear,
  };
}
