import { Emitter } from '@app/shared/lib/services/Emitter';
import { throwError } from '@app/shared/lib/services/errorService';

import { getDefaultSessionService } from '../lib/sessionServiceInstance';
import { Session } from '../types';
import { SessionScheme } from '../validation/SessionScheme';

export function storeSession(session: Session) {
  try {
    SessionScheme.parse(session);
    getDefaultSessionService().setSession(session);
  } catch (e: any) {
    throwError('[storeSession]: Invalid session object has been provided');
    throwError(e);
  }
}

export function storeAccessToken(accessToken: string) {
  if (!accessToken) {
    throwError('[storeAccessToken]: No access token has been provided');
  }

  getDefaultSessionService().setSession({ accessToken });
}

export function storeRefreshToken(refreshToken: string) {
  if (!refreshToken) {
    throwError('[storeRefreshToken]: No refresh token has been provided');
  }

  getDefaultSessionService().setSession({ refreshToken });
}

export function refreshTokenFailed() {
  Emitter.emit('refresh-token-fail');
}
