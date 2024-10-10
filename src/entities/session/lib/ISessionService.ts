import { MMKV } from 'react-native-mmkv';

import { Session } from '../types';

export type ISessionService = {
  getSession: () => Partial<Session>;
  setSession: (value: Partial<Session>) => void;
  clearSession: () => void;
  getStorage: () => MMKV;
};
