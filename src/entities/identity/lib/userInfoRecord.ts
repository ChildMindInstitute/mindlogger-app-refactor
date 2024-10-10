import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

const EMAIL_KEY = 'email';

function UserInfoRecord() {
  const storage = getDefaultStorageInstanceManager().getUserInfoStorage();

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

let defaultRecord: ReturnType<typeof UserInfoRecord>;
export const getDefaultUserInfoRecord = () => {
  if (!defaultRecord) {
    defaultRecord = UserInfoRecord();
  }
  return defaultRecord;
};
