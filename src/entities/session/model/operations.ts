import { Emitter } from '@app/shared/lib';

import storage from './storage';
import { Session } from './types';

export function storeSession(session: Partial<Session>) {
  storage.setSession(session);
}

export function refreshTokenFailed() {
  Emitter.emit('refresh-token-fail');
}

export const getSession = storage.getSession;
