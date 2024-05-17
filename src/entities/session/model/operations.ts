import { Emitter, throwError } from '@app/shared/lib';

import { sessionService } from '../lib';
import { Session } from '../types';
import { SessionScheme } from '../validation';

export function storeSession(session: Session) {
  try {
    SessionScheme.parse(session);
    sessionService.setSession(session);
  } catch (e: any) {
    throwError('[storeSession]: Invalid session object has been provided');
    throwError(e);
  }
}

export function storeAccessToken(accessToken: string) {
  if (!accessToken) {
    throwError('[storeAccessToken]: No access token has been provided');
  }

  sessionService.setSession({ accessToken });
}

export function storeRefreshToken(refreshToken: string) {
  if (!refreshToken) {
    throwError('[storeRefreshToken]: No refresh token has been provided');
  }

  sessionService.setSession({ refreshToken });
}

export function refreshTokenFailed() {
  Emitter.emit('refresh-token-fail');
}

export const getSession = sessionService.getSession;
export const clearSession = sessionService.clearSession;
