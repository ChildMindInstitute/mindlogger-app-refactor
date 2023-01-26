import storage from './storage';
import { Session } from './types';

type StoreSessionOptions = {
  encryptWithKey: string;
};

export function storeSession(
  session: Partial<Session>,
  options?: StoreSessionOptions,
) {
  storage.setSession(session);

  if (options?.encryptWithKey) {
    storage.encrypt(options.encryptWithKey);
  }
}

export const getSession = storage.getSession;
