import { MMKV } from 'react-native-mmkv';

import { Session } from './types';

const storage = new MMKV({
  id: 'session-storage',
});

type Listener = (...args: any[]) => any;

const isEqual = (
  prevSession: Partial<Session>,
  nextSession: Partial<Session>,
) => {
  return (
    prevSession.accessToken === nextSession.accessToken &&
    prevSession.refreshToken === nextSession.refreshToken &&
    prevSession.tokenType === nextSession.tokenType
  );
};

function SessionStorage() {
  let listeners: Listener[] = [];
  let session = {} as Partial<Session>;

  function getSession() {
    const sessionKeys = storage.getString('sessionKeys');

    if (sessionKeys) {
      const newSession = JSON.parse(sessionKeys) as Partial<Session>;

      session = isEqual(session, newSession) ? session : newSession;
    }

    return session;
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

    encrypt(key: string) {
      storage.recrypt(key);
    },

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
