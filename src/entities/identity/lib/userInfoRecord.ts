import { createSecureStorage } from '@app/shared/lib';

const storage = createSecureStorage('user-email');

const storageKey = 'email';

function UserEmailRecord() {
  function get(): string | undefined {
    return storage.getString(storageKey);
  }

  function set(email: string) {
    storage.set(storageKey, email);
  }

  function clear() {
    return storage.delete(storageKey);
  }

  return {
    get,
    set,
    clear,
  };
}

export default UserEmailRecord();
