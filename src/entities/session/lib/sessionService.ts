import { MMKV } from 'react-native-mmkv';

import { ISessionService } from './ISessionService';
import { Session } from '../types';

export function SessionService(sessinoStorage: MMKV): ISessionService {
  function getSession() {
    const sessionKeys = sessinoStorage.getString('sessionKeys');

    return (sessionKeys ? JSON.parse(sessionKeys) : {}) as Partial<Session>;
  }

  function setSession(value: Partial<Session>) {
    const sessionKeys = getSession();

    sessinoStorage.set(
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
      sessinoStorage.clearAll();
    },

    getStorage() {
      return sessinoStorage;
    },
  };
}
