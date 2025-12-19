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

  const status = error.response?.status;
  const errorMessage = error.message?.toLowerCase() || '';
  const errorType =
    error.response?.data?.result?.[0]?.type?.toLowerCase() || '';

  // Handle specific HTTP status codes
  if (status === 401) {
    // 401 Unauthorized - Invalid code or expired session
    if (
      errorMessage.includes('invalid') ||
      errorMessage.includes('incorrect') ||
      errorType.includes('invalid')
    ) {
      return `${namespace}:error_invalid_code`;
    }
    if (
      errorMessage.includes('expired') ||
      errorMessage.includes('session') ||
      errorType.includes('expired')
    ) {
      return `${namespace}:error_session_expired`;
    }
    return `${namespace}:error_invalid_code`;
  }

  if (status === 404) {
    // 404 Not Found - Recovery code not found (specific to recovery flow)
    if (namespace === 'mfa_recovery') {
      return `${namespace}:error_code_not_found`;
    }
    return `${namespace}:error_session_expired`;
  }

  if (status === 429) {
    // 429 Too Many Requests - Rate limit exceeded
    return `${namespace}:error_too_many_attempts`;
  }

  // Network errors (no response)
  if (!status && errorMessage.includes('network')) {
    return `${namespace}:error_network`;
  }

  // Check error message content for specific error types
  if (errorMessage.includes('token') && errorMessage.includes('expired')) {
    return `${namespace}:error_session_expired`;
  }

  if (errorMessage.includes('too many')) {
    return `${namespace}:error_too_many_attempts`;
  }

  if (errorMessage.includes('not found') && namespace === 'mfa_recovery') {
    return `${namespace}:error_code_not_found`;
  }

  return `${namespace}:error_unknown`;
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
  const errorMessage = error.message?.toLowerCase() || '';

  return (
    status === 429 ||
    (status === 401 &&
      (errorMessage.includes('expired') || errorMessage.includes('session'))) ||
    errorMessage.includes('too many')
  );
};
