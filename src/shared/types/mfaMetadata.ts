export interface MfaErrorMetadata {
  session_attempts_remaining?: number;
  global_attempts_remaining?: number;
  lockout_reason?: string;
}

export interface MfaApiError extends Error {
  error_code: string;
  response?: {
    data?: {
      error_code?: string;
      metadata?: MfaErrorMetadata;
    };
  };
}
