import { createSecureStorage } from '@app/shared/lib';

const storage = createSecureStorage('user-info');

const emailKey = 'email';

function UserInfoRecord() {
  function get(): string | undefined {
    return storage.getString(emailKey);
  }

  function set(email: string) {
    storage.set(emailKey, email);
  }

  function clear() {
    return storage.delete(emailKey);
  }

  return {
    get,
    set,
    clear,
  };
}

export default UserInfoRecord();
