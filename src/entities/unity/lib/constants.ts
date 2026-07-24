// Interval between heartbeat Echo messages sent to Unity (ms).
export const HEARTBEAT_INTERVAL_MS = 5000;

// Timeout for a single heartbeat Echo response from Unity (ms).
export const HEARTBEAT_TIMEOUT_MS = 3000;

// Number of consecutive heartbeat failures before Unity is declared unresponsive.
export const MAX_HEARTBEAT_FAILURES = 2;

// Maximum time to wait for UnityStarted event after mounting (ms).
export const STARTUP_TIMEOUT_MS = 30000;

// Maximum time to wait for LoadConfigFile to complete after UnityStarted (ms).
export const CONFIG_LOAD_TIMEOUT_MS = 30000;

// Maximum time to wait for a reply to the Echo probe sent on mount when Unity is already running from a previous activity (ms).
export const IDLE_PROBE_TIMEOUT_MS = 3000;

// Maximum time to wait for Reset confirmation when resetting the previous Unity session on mount (ms).
export const ABANDONED_UNITY_RESET_TIMEOUT_MS = 20000; // significantly shorter than STARTUP_TIMEOUT_MS so recovery finishes before the startup timeout

// Maximum time to wait for Reset confirmation before unmounting (ms).
export const END_UNITY_RESET_TIMEOUT_MS = 3000;
