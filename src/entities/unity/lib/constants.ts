/** Interval between heartbeat Echo messages sent to Unity (ms). */
export const HEARTBEAT_INTERVAL_MS = 5000;

/** Timeout for a single heartbeat Echo response from Unity (ms). */
export const HEARTBEAT_TIMEOUT_MS = 3000;

/** Number of consecutive heartbeat failures before Unity is declared unresponsive. */
export const MAX_HEARTBEAT_FAILURES = 2;
