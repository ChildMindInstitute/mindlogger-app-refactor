// Interval between heartbeat Echo messages sent to Unity (ms).
export const HEARTBEAT_INTERVAL_MS = 10000;

// Timeout for a single heartbeat Echo response from Unity (ms). Generous
// because Unity's main thread can be saturated by scene loads and data saving
// while still healthy.
export const HEARTBEAT_TIMEOUT_MS = 8000;

// Number of consecutive heartbeat failures before Unity is declared unresponsive.
export const MAX_HEARTBEAT_FAILURES = 3;

// Maximum time to wait for UnityStarted event after mounting (ms).
export const STARTUP_TIMEOUT_MS = 30000;

// Maximum time to wait for LoadConfigFile to complete after UnityStarted (ms).
export const CONFIG_LOAD_TIMEOUT_MS = 30000;

// Android: time to wait for UnityStarted event after remounting before driving
// the handshake ourselves (ms).
export const ANDROID_REMOUNT_HANDSHAKE_DELAY_MS = 5000;

// Android: interval between LoadConfigFile attempts (ms). Unity drops configs
// that arrive while its scene is still reloading, so resend until acknowledged.
export const LOAD_CONFIG_RETRY_INTERVAL_MS = 5000;
