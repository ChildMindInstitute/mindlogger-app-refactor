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

// Android: delay after remounting the Unity view before sending `Reset` to
// the already-running engine (ms). Covers the native reattach and resume.
export const ANDROID_REMOUNT_RESET_DELAY_MS = 300;

// Android: delay after the remount `Reset` before driving the handshake
// ourselves (ms). Gives the scene reload time to finish; a config sent too
// early is dropped by Unity.
export const ANDROID_REMOUNT_HANDSHAKE_DELAY_MS = 5000;

// Android: how long to wait for Unity to acknowledge the end-of-task Reset
// before unmounting anyway (ms). Lets the scene reload finish on-screen.
export const END_RESET_ACK_TIMEOUT_MS = 10000;

// Android: interval between LoadConfigFile attempts (ms). Unity drops configs
// that arrive while its scene is still reloading, so resend until acknowledged.
export const LOAD_CONFIG_RETRY_INTERVAL_MS = 5000;
