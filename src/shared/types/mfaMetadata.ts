export interface MfaErrorMetadata {
  session_attempts_remaining?: number;
  global_attempts_remaining?: number;
  lockout_reason?: string;
  lockout_ttl_seconds?: number;
}

export interface MfaApiError extends Error {
  response?: {
    data?: {
      error_code?: string;
      metadata?: MfaErrorMetadata;
    };
  };
}
