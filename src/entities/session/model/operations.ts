import { Emitter, throwError } from '@app/shared/lib';

import storage from './storage';
import { Session } from './types';
import { SessionScheme } from '../validation';

export function storeSession(session: Session) {
  try {
    SessionScheme.parse(session);
    storage.setSession(session);
  } catch (e: any) {
    throwError('[storeSession]: Invalid session object has been provided');
    throwError(e);
  }
}

export function storeAccessToken(accessToken: string) {
  if (!accessToken) {
    throwError('[storeAccessToken]: No access token has been provided');
  }

  storage.setSession({ accessToken });
}

export function storeRefreshToken(refreshToken: string) {
  if (!refreshToken) {
    throwError('[storeRefreshToken]: No refresh token has been provided');
  }

  storage.setSession({ refreshToken });
}

export function refreshTokenFailed() {
  Emitter.emit('refresh-token-fail');
}

export const getSession = storage.getSession;
