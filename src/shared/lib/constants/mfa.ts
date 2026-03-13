/**
 * MFA (Multi-Factor Authentication) Constants
 */

// Session management

/** Backend MFA session TTL: 5 minutes */
export const BACKEND_SESSION_TTL_MS = 300000;

/** Frontend expiry threshold: 4.5 minutes (30s safety buffer) */
export const SESSION_EXPIRY_THRESHOLD_MS = 270000;

/** Safety buffer for network latency and clock skew: 30 seconds */
export const SESSION_SAFETY_BUFFER_MS =
  BACKEND_SESSION_TTL_MS - SESSION_EXPIRY_THRESHOLD_MS;

// Auto-submit configuration

/** Delay before auto-submitting code: 300ms */
export const AUTO_SUBMIT_DELAY_MS = 300;

// Code format requirements

/** TOTP code length: 6 digits */
export const TOTP_CODE_LENGTH = 6;

/** Recovery code length: 10 characters (XXXXX-XXXXX without hyphen) */
export const RECOVERY_CODE_LENGTH = 10;

/** Recovery code format length: 11 characters (including hyphen) */
export const RECOVERY_CODE_FORMAT_LENGTH = 11;

// Rate limiting

/** Max attempts per MFA session: 5 */
export const MAX_ATTEMPTS_PER_SESSION = 5;

/** Max attempts across all sessions: 10 */
export const MAX_GLOBAL_ATTEMPTS = 10;

/** Global lockout duration: 15 minutes */
export const GLOBAL_LOCKOUT_DURATION_MS = 900000;

// Time conversions

export const MS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;

// Calculated values

export const BACKEND_SESSION_TTL_MINUTES =
  BACKEND_SESSION_TTL_MS / MS_PER_MINUTE;

export const SESSION_EXPIRY_THRESHOLD_MINUTES =
  SESSION_EXPIRY_THRESHOLD_MS / MS_PER_MINUTE;

export const SESSION_SAFETY_BUFFER_SECONDS =
  SESSION_SAFETY_BUFFER_MS / MS_PER_SECOND;

export const AUTO_SUBMIT_DELAY_SECONDS = AUTO_SUBMIT_DELAY_MS / MS_PER_SECOND;

export const GLOBAL_LOCKOUT_DURATION_MINUTES =
  GLOBAL_LOCKOUT_DURATION_MS / MS_PER_MINUTE;
