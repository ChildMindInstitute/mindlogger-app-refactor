/**
 * MFA (Multi-Factor Authentication) Constants
 *
 * Centralized configuration for MFA verification and recovery flows
 */

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Backend MFA session Time-To-Live (TTL)
 * The duration for which an MFA session remains valid on the backend
 * @constant {number} 300000ms = 5 minutes
 */
export const BACKEND_SESSION_TTL_MS = 300000;

/**
 * Frontend session expiry threshold
 * Time after which auto-submit is disabled and warning is shown
 * Set to 4.5 minutes to provide 30-second safety buffer before backend expiry
 * @constant {number} 270000ms = 4.5 minutes
 */
export const SESSION_EXPIRY_THRESHOLD_MS = 270000;

/**
 * Safety buffer between frontend threshold and backend expiry
 * Accounts for network latency, backend processing, and clock skew
 * @constant {number} 30000ms = 30 seconds
 */
export const SESSION_SAFETY_BUFFER_MS =
  BACKEND_SESSION_TTL_MS - SESSION_EXPIRY_THRESHOLD_MS;

// ============================================================================
// AUTO-SUBMIT CONFIGURATION
// ============================================================================

/**
 * Delay before auto-submitting verification code
 * Gives user time to review the code they entered
 * @constant {number} 300ms
 */
export const AUTO_SUBMIT_DELAY_MS = 300;

// ============================================================================
// CODE FORMAT REQUIREMENTS
// ============================================================================

/**
 * Required length for TOTP verification code
 * @constant {number} 6 digits
 */
export const TOTP_CODE_LENGTH = 6;

/**
 * Required length for recovery code (format: XXXXX-XXXXX)
 * @constant {number} 10 characters (excluding hyphen)
 */
export const RECOVERY_CODE_LENGTH = 10;

/**
 * Recovery code format pattern (5 chars - hyphen - 5 chars)
 * @constant {number} 11 characters total including hyphen
 */
export const RECOVERY_CODE_FORMAT_LENGTH = 11;

// ============================================================================
// RATE LIMITING (Backend Configuration)
// ============================================================================

/**
 * Maximum failed verification attempts per MFA session
 * After this limit, user must log in again
 * @constant {number} 5 attempts
 * @see Backend: src/config/redis.py - mfa_max_attempts
 */
export const MAX_ATTEMPTS_PER_SESSION = 5;

/**
 * Maximum failed attempts across all sessions per user
 * After this limit, user is temporarily locked out
 * @constant {number} 10 attempts
 * @see Backend: src/config/redis.py - mfa_global_lockout_attempts
 */
export const MAX_GLOBAL_ATTEMPTS = 10;

/**
 * Duration of global lockout after exceeding max attempts
 * @constant {number} 900000ms = 15 minutes
 * @see Backend: src/config/redis.py - mfa_global_lockout_ttl
 */
export const GLOBAL_LOCKOUT_DURATION_MS = 900000;

// ============================================================================
// TIME CONVERSIONS (Helper Constants)
// ============================================================================

/**
 * Milliseconds in one second
 * @constant {number} 1000ms
 */
export const MS_PER_SECOND = 1000;

/**
 * Seconds in one minute
 * @constant {number} 60 seconds
 */
export const SECONDS_PER_MINUTE = 60;

/**
 * Milliseconds in one minute
 * @constant {number} 60000ms
 */
export const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;

// ============================================================================
// CALCULATED VALUES (For Reference and Testing)
// ============================================================================

/**
 * Backend session TTL in minutes
 * @constant {number} 5 minutes
 */
export const BACKEND_SESSION_TTL_MINUTES =
  BACKEND_SESSION_TTL_MS / MS_PER_MINUTE;

/**
 * Frontend threshold in minutes
 * @constant {number} 4.5 minutes
 */
export const SESSION_EXPIRY_THRESHOLD_MINUTES =
  SESSION_EXPIRY_THRESHOLD_MS / MS_PER_MINUTE;

/**
 * Safety buffer in seconds
 * @constant {number} 30 seconds
 */
export const SESSION_SAFETY_BUFFER_SECONDS =
  SESSION_SAFETY_BUFFER_MS / MS_PER_SECOND;

/**
 * Auto-submit delay in seconds
 * @constant {number} 0.3 seconds
 */
export const AUTO_SUBMIT_DELAY_SECONDS = AUTO_SUBMIT_DELAY_MS / MS_PER_SECOND;

/**
 * Global lockout duration in minutes
 * @constant {number} 15 minutes
 */
export const GLOBAL_LOCKOUT_DURATION_MINUTES =
  GLOBAL_LOCKOUT_DURATION_MS / MS_PER_MINUTE;
