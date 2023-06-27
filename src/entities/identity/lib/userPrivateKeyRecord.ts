import { createSecureStorage } from '@shared/lib';

const storage = createSecureStorage('user-private-key');

const storeKey = 'private-key';

type PrivateKey = number[];

function UserPrivateKeyRecord() {
  function get(): PrivateKey | undefined {
    const value = storage.getString(storeKey);

    if (value) {
      return JSON.parse(value);
    }
  }

  function set(privateKey: PrivateKey) {
    storage.set(storeKey, JSON.stringify(privateKey));
  }

  function clear() {
    return storage.delete(storeKey);
  }

  return {
    get,
    set,
    clear,
  };
}

export default UserPrivateKeyRecord();
