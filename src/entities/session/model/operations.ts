import storage from './storage';
import { Session } from './types';

export function storeSession(session: Partial<Session>) {
  storage.setSession(session);
}

export const getSession = storage.getSession;
