import { BaseError } from '@app/shared/api/types';

import { getMfaErrorMessage, shouldNavigateToLogin } from '../mfaErrorHandler';

describe('mfaErrorHandler', () => {
  describe('getMfaErrorMessage', () => {
    it('should return invalid code message for 401 error', () => {
      const error: BaseError = {
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 401,
          data: {
            result: [
              { message: 'Invalid code', type: 'InvalidCode', path: [] },
            ],
          },
        },
        message: 'Invalid code',
      };

      const result = getMfaErrorMessage(error, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_invalid_code');
    });

    it('should return session expired message for 404 error', () => {
      const error: BaseError = {
        code: 'ERR_NOT_FOUND',
        response: {
          status: 404,
          data: {
            result: [
              {
                message: 'Session not found',
                type: 'SessionNotFound',
                path: [],
              },
            ],
          },
        },
        message: 'Session not found',
      };

      const result = getMfaErrorMessage(error, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_session_expired');
    });

    it('should return code not found for 404 error in recovery namespace', () => {
      const error: BaseError = {
        code: 'ERR_NOT_FOUND',
        response: {
          status: 404,
          data: {
            result: [
              {
                message: 'Recovery code not found',
                type: 'CodeNotFound',
                path: [],
              },
            ],
          },
        },
        message: 'Recovery code not found',
      };

      const result = getMfaErrorMessage(error, 'mfa_recovery');
      expect(result).toBe('mfa_recovery:error_code_not_found');
    });

    it('should return too many attempts message for 429 error', () => {
      const error: BaseError = {
        code: 'ERR_TOO_MANY_REQUESTS',
        response: {
          status: 429,
          data: {
            result: [
              {
                message: 'Too many attempts',
                type: 'RateLimitExceeded',
                path: [],
              },
            ],
          },
        },
        message: 'Too many attempts',
      };

      const result = getMfaErrorMessage(error, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_too_many_attempts');
    });

    it('should return generic error message for other status codes', () => {
      const error: BaseError = {
        code: 'ERR_INTERNAL_SERVER',
        response: {
          status: 500,
          data: {
            result: [
              {
                message: 'Internal server error',
                type: 'InternalServerError',
                path: [],
              },
            ],
          },
        },
        message: 'Internal server error',
      };

      const result = getMfaErrorMessage(error, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_unknown');
    });

    it('should return network error message when no response status', () => {
      const error: Partial<BaseError> = {
        code: 'ERR_NETWORK',
        message: 'Network Error',
      };

      const result = getMfaErrorMessage(error as BaseError, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_network');
    });

    it('should handle null error', () => {
      const result = getMfaErrorMessage(null, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_unknown');
    });

    it('should handle undefined error', () => {
      const result = getMfaErrorMessage(undefined, 'mfa_verification');
      expect(result).toBe('mfa_verification:error_unknown');
    });
  });

  describe('shouldNavigateToLogin', () => {
    it('should return false for 404 error without session message', () => {
      const error: BaseError = {
        code: 'ERR_NOT_FOUND',
        response: {
          status: 404,
          data: { result: [] },
        },
        message: 'Not found',
      };

      expect(shouldNavigateToLogin(error)).toBe(false);
    });

    it('should return true for 401 error with expired session', () => {
      const error: BaseError = {
        code: 'ERR_UNAUTHORIZED',
        response: {
          status: 401,
          data: { result: [] },
        },
        message: 'Session expired',
      };

      expect(shouldNavigateToLogin(error)).toBe(true);
    });

    it('should return true for 429 error (rate limit)', () => {
      const error: BaseError = {
        code: 'ERR_TOO_MANY_REQUESTS',
        response: {
          status: 429,
          data: { result: [] },
        },
        message: 'Too many requests',
      };

      expect(shouldNavigateToLogin(error)).toBe(true);
    });

    it('should return false for 401 error (invalid code)', () => {
      const error: BaseError = {
        code: 'ERR_UNAUTHORIZED',
        response: {
          status: 401,
          data: { result: [] },
        },
        message: 'Unauthorized',
      };

      expect(shouldNavigateToLogin(error)).toBe(false);
    });

    it('should return false for other errors', () => {
      const error: BaseError = {
        code: 'ERR_INTERNAL',
        response: {
          status: 500,
          data: { result: [] },
        },
        message: 'Internal error',
      };

      expect(shouldNavigateToLogin(error)).toBe(false);
    });

    it('should return false when no response', () => {
      const error: Partial<BaseError> = {
        code: 'ERR_NETWORK',
        message: 'Network Error',
      };

      expect(shouldNavigateToLogin(error as BaseError)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(shouldNavigateToLogin(null)).toBe(false);
    });

    it('should return false for undefined error', () => {
      expect(shouldNavigateToLogin(undefined)).toBe(false);
    });
  });
});
