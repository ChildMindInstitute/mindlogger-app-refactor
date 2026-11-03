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

// Delay after remounting the Unity view before sending `Reset` to the
// already-running engine (ms). Covers the native reattach and resume.
export const REMOUNT_RESET_DELAY_MS = 300;

// How long to wait for Unity to acknowledge the remount `Reset` before driving
// the handshake anyway (ms). Covers restarting after a Unity error.
export const REMOUNT_RESET_ACK_TIMEOUT_MS = 10000;

// Time to wait for UnityStarted event after remounting onto the kept-alive
// engine before driving the handshake ourselves (ms).
export const REMOUNT_HANDSHAKE_DELAY_MS = 5000;

// Android: interval between LoadConfigFile attempts (ms). Unity drops configs
// that arrive while its scene is still reloading, so resend until acknowledged.
export const LOAD_CONFIG_RETRY_INTERVAL_MS = 5000;
