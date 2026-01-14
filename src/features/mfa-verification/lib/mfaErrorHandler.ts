import { BaseError } from '@app/shared/api/types';
import { MfaApiError, MfaErrorMetadata } from '@app/shared/types/mfaMetadata';

export interface MfaErrorResult {
  messageKey: string;
  metadata: MfaErrorMetadata | null;
}

export const getMfaErrorMessage = (
  error: BaseError | null | undefined,
  namespace: 'mfa_verification' | 'mfa_recovery',
): string => {
  if (!error) {
    return `${namespace}:error_unknown`;
  }

  const responseData = error.response?.data as any;
  const errorCode = responseData?.error_code || '';

  // Map backend error codes to translation keys
  switch (errorCode) {
    case 'AUTH.MFA.TOKEN_EXPIRED':
    case 'AUTH.MFA.TOKEN_INVALID':
    case 'AUTH.MFA.SESSION_NOT_FOUND':
      return `${namespace}:error_session_expired`;

    case 'AUTH.MFA.GLOBAL_LOCKOUT':
      return `${namespace}:error_global_lockout`;

    case 'AUTH.MFA.TOO_MANY_ATTEMPTS':
      return `${namespace}:error_too_many_attempts`;

    case 'AUTH.MFA.INVALID_TOTP_CODE':
      return `${namespace}:error`;

    default:
      // Fallback to status code checks if error_code is not present
      break;
  }

  // Fallback: Check HTTP status codes (legacy support)
  const status = error.response?.status;
  const errorMessage = error.message?.toLowerCase() || '';
  const axiosErrorCode = error.code?.toLowerCase() || '';

  if (status === 429) {
    return `${namespace}:error_too_many_attempts`;
  }

  if (status === 404) {
    if (namespace === 'mfa_recovery') {
      return `${namespace}:error_code_not_found`;
    }
    return `${namespace}:error_session_expired`;
  }

  // Timeout errors (request took too long)
  if (axiosErrorCode === 'econnaborted' || errorMessage.includes('timeout')) {
    return `${namespace}:error_network`;
  }

  // Network errors (no response)
  if (!status && errorMessage.includes('network')) {
    return `${namespace}:error_network`;
  }

  // Default to simple error message for better UX
  return `${namespace}:error`;
};

export const extractMfaErrorMetadata = (
  error: unknown,
): MfaErrorMetadata | null => {
  try {
    const apiError = error as MfaApiError;
    return apiError?.response?.data?.metadata || null;
  } catch {
    return null;
  }
};

export const getMfaErrorDetails = (
  error: unknown,
  namespace: 'mfa_verification' | 'mfa_recovery',
): MfaErrorResult => {
  const messageKey = getMfaErrorMessage(error as BaseError, namespace);
  const metadata = extractMfaErrorMetadata(error);

  return { messageKey, metadata };
};

export const shouldNavigateToLogin = (
  error: BaseError | null | undefined,
): boolean => {
  if (!error) {
    return false;
  }

  const status = error.response?.status;
  const responseData = error.response?.data as any;
  const errorCode = responseData?.error_code || '';

  // Check backend error codes - these require navigation to login
  const ERROR_CODES_REQUIRING_LOGIN = [
    'AUTH.MFA.TOKEN_EXPIRED', // MFA token expired (5 min timeout)
    'AUTH.MFA.TOKEN_INVALID', // MFA token invalid or corrupted
    'AUTH.MFA.SESSION_NOT_FOUND', // MFA session not found (expired)
    'AUTH.MFA.TOO_MANY_ATTEMPTS', // Too many failed attempts (rate limit)
    'AUTH.MFA.GLOBAL_LOCKOUT', // Global lockout across all sessions
  ];

  // Check by error code (most reliable)
  if (ERROR_CODES_REQUIRING_LOGIN.includes(errorCode)) {
    return true;
  }

  // Fallback: Check HTTP status 429 (rate limit)
  if (status === 429) {
    return true;
  }

  return false;
};
