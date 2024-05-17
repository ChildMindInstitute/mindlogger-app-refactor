import { createSecureStorage } from '@shared/lib';

import { Session } from '../types';

const storage = createSecureStorage('session-storage');

function SessionService() {
  function getSession() {
    const sessionKeys = storage.getString('sessionKeys');

    return (sessionKeys ? JSON.parse(sessionKeys) : {}) as Partial<Session>;
  }

  function setSession(value: Partial<Session>) {
    const sessionKeys = getSession();

    storage.set(
      'sessionKeys',
      JSON.stringify({
        ...sessionKeys,
        ...value,
      }),
    );
  }

  return {
    getSession,
    setSession,

    clearSession() {
      storage.clearAll();
    },

    getStorage() {
      return storage;
    },
  };
}

export default SessionService();
