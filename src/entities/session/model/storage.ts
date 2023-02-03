import { createSecureStorage } from '@app/shared/lib';

import { Session } from './types';

const storage = createSecureStorage('session-storage');

type Listener = (...args: any[]) => any;

function SessionStorage() {
  let listeners: Listener[] = [];

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

    listeners.forEach(listener => listener());
  }

  return {
    getSession,
    setSession,

    clearAll() {
      storage.clearAll();
    },

    subscribe(listener: Listener) {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter(item => item !== listener);
      };
    },
  };
}

export default SessionStorage();
