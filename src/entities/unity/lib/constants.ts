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

// Maximum time to wait for Reset confirmation before unmounting (ms).
export const RESET_TIMEOUT_MS = 3000;

// Timeout for Echo probe sent when Unity is expected to be idle in loading scene from previous activity (ms).
export const IDLE_PROBE_TIMEOUT_MS = 3000;
