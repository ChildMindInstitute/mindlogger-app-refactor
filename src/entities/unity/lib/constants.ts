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

// Android keep-alive: delay after (re)mounting the Unity view before sending
// `Reset` to the resident engine (ms). The engine survives unmounts on Android
// (it cannot be unloaded and re-created in the same process). A scene reload
// that was interrupted by an unmount NEVER resumes — the engine's message pump
// keeps running but the reload is permanently stuck, so every LoadConfigFile
// sent into that scene is dropped with an NRE (proven: 6 retries over 26s all
// failed). Instead of talking to the stuck scene, we send `Reset` to force a
// fresh reload that runs entirely on-screen; once it has had time to finish we
// drive the handshake ourselves (see ANDROID_REMOUNT_HANDSHAKE_DELAY_MS). This
// delay only needs to cover the native reattach+resume (~150ms observed).
export const ANDROID_REMOUNT_RESET_DELAY_MS = 300;

// Android keep-alive: delay after the remount `Reset` before manually driving
// the handshake (heartbeat + LoadConfigFile) ourselves (ms). The Unity app acks the
// remount Reset and reloads, but it only sends `UnityStarted` on a fresh boot —
// never after a reload — so the app must start the handshake itself. The reload
// needs ~2-3s after the Reset to register its config handler; a LoadConfigFile
// landing before that is dropped with an NRE, so wait it out (the retry loop in
// handleUnityReady is the safety net if the reload is slower than this). Do not
// lower this much further: an early config costs an NRE plus a 5s retry wait,
// which is slower than just waiting out the reload.
export const ANDROID_REMOUNT_HANDSHAKE_DELAY_MS = 5000;

// Android keep-alive: how long to wait for Unity to acknowledge the
// end-of-task Reset ("Loaded Successfully") before unmounting anyway (ms).
// Waiting lets the scene reload finish on-screen instead of hidden behind the
// Activities list; a healthy reload acks in ~2-3s.
export const END_RESET_ACK_TIMEOUT_MS = 10000;

// Android keep-alive: interval between LoadConfigFile attempts (ms). After Reset
// the Unity app reloads its scene; that reload can be paused mid-flight by the
// unmount and resumes on the next mount, so a LoadConfigFile sent too early lands
// before the new scene's config handler exists — Unity drops it with an NRE and never
// acknowledges. Resend until acknowledged. Must be comfortably longer than a
// healthy ack (~1.5s observed).
export const LOAD_CONFIG_RETRY_INTERVAL_MS = 5000;
