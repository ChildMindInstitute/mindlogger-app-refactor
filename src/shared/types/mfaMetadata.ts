export interface MfaErrorMetadata {
  session_attempts_remaining?: number;
  global_attempts_remaining?: number;
  lockout_reason?: string;
}

export interface MfaApiError extends Error {
  response?: {
    data?: {
      error_code?: string;
      metadata?: MfaErrorMetadata;
    };
  };
}
