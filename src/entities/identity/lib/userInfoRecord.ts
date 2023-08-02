import { createSecureStorage } from '@app/shared/lib';

const storage = createSecureStorage('user-info');

const EMAIL_KEY = 'email';

function UserInfoRecord() {
  function clear() {
    return storage.clearAll();
  }

  function getEmail() {
    return storage.getString(EMAIL_KEY);
  }

  function setEmail(email: string) {
    return storage.set(EMAIL_KEY, email);
  }

  return {
    clear,

    getEmail,
    setEmail,
  };
}

export default UserInfoRecord();
