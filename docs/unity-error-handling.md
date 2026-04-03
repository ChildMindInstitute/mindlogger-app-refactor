# Unity Error Handling & Recovery

Branch: `fix/heart-beat-echo`
Base: `elsie/unity-load-config`

---

## 1. Initial Bugs

### Bug 1: Echo Caused Premature Config Loading

**Symptom:** `LoadConfigFile` was sent before Unity was ready, or sent twice.

**Root cause:** The base branch had a "backup" `useEffect` that sent an Echo message at component mount. When the Echo succeeded, its `.then()` handler called `handleUnityReady()` — the same function that sends `LoadConfigFile`. This created a race condition with the primary `UnityStarted` event handler:

```
Mount → backup Echo sent immediately
  → Echo succeeds → handleUnityReady() → LoadConfigFile (premature!)
  → sets unityReadyHandled = true

Unity boots → sends UnityStarted
  → handler sees unityReadyHandled = true → skips ← real lifecycle bypassed
```

**Fix:** Removed the backup Echo `useEffect` entirely, along with `usePreviousValue`, `unityViewKeyWas`, and `newEchoMessage` import. (`83504ad5`)

### Bug 2: Echo Sent Too Early / Only Once

**Symptom:** Heartbeat wasn't functioning — either fired before Unity could respond or only ran once.

**Root cause:** In the base branch, `handleUnityReady` had a 5-second `setTimeout` wrapping the `LoadConfigFile` send. The Echo was tied to this same timing, meaning it fired once at an arbitrary moment rather than on a recurring interval gated by Unity's readiness.

**Fix:** Removed the 5s delay (`d945443e`), then built a proper heartbeat system that starts a recurring `setInterval` only after `UnityStarted` is received (`a233e5ef`).

---

## 2. Original Flow (Base Branch)

```
Mount
  → backup Echo useEffect fires immediately (race condition)
  → setUnityViewKey(uuid) → RNUnityView renders
  → Unity boots → sends UnityStarted
    → handleUnityReady()
      → wait 5s (setTimeout)
      → send LoadConfigFile
  → No ongoing health monitoring
  → No error recovery
```

**Problems:**
- No detection if Unity crashes, freezes, or unloads
- No user-facing error UI
- No way to restart or skip a broken activity

---

## 3. Current Flow

```
Mount (0s)
  ├── setUnityViewKey(uuid) → RNUnityView renders
  └── Start STARTUP_TIMEOUT (30s)

Unity boots → sends UnityStarted (~3s)
  ├── Clear startup timeout
  ├── startHeartbeat() → Echo every 5s
  ├── Start CONFIG_LOAD_TIMEOUT (30s)
  └── await handleUnityReady() → send LoadConfigFile

Config loaded (~5s)
  ├── Clear config load timeout
  └── User interacts with MERIT task

Ongoing monitoring:
  └── Heartbeat Echo every 5s (3s timeout per echo)
      ├── 1st failure → spinner overlay
      └── 2nd consecutive failure → error modal
```

---

## 4. Features Added

### Heartbeat System
- **Echo protocol:** React sends `m_sKey: "Echo"` with a unique payload every 5s. Unity echoes back the same payload. Independent of task loading — operates at the bridge layer.
- **Failure detection:** 3s timeout per echo. After 2 consecutive failures, Unity is declared dead.
- **First-failure feedback:** Spinner overlay appears on the first missed echo, before the modal.

### Error Modal (Figma design)
- **Restartable (unload):** "Restart" + "exit" buttons. Unity unloaded but iOS process alive — restart possible.
- **Non-restartable (quit):** "exit" button only. Unity runtime terminated — restart impossible in this iOS session.
- **Flow-aware:** In activity flows, "Skip" advances to the next activity. Solo activities dismiss to the parent screen.

### Staged Unmount Restart
When the user taps "Restart":
1. `setUnityViewKey(null)` → removes RNUnityView from the tree
2. Wait 1 second (native teardown)
3. `setUnityViewKey(newUuid)` → mounts fresh RNUnityView → Unity boots again
4. Full lifecycle restarts (startup timeout, heartbeat, config load timeout)

### Activity Flow Integration
- `onError` prop wired through `ActivityItem` → `ActivityStepper` → flow pipeline
- On "Skip", the flow advances to the next activity without crashing the whole assessment

---

## 5. Safety Nets

| Safety Net | Detects | Timeout | Failure Mode |
|---|---|---|---|
| **Startup timeout** | Unity never boots (crash during init, freeze before `UnityStarted`) | 30s | `quit` (non-restartable) |
| **Config load timeout** | `LoadConfigFile` never completes (React-side hang, Unity ignoring message, network failure) | 30s | `quit` (non-restartable) |
| **Heartbeat Echo** | Unity dies/freezes after config loaded (crash, unload, freeze, memory pressure kill) | ~8–16s | Depends on native event |

### Why three nets?

The heartbeat alone has blind spots:
- **Before `UnityStarted`:** Heartbeat hasn't started yet. If Unity hangs during boot, nothing would detect it → startup timeout covers this.
- **During `LoadConfigFile`:** Heartbeat is running but Unity is alive (responding to Echo). If the config load hangs on the React side or Unity silently fails to process it, heartbeat won't catch it → config load timeout covers this.
- **After config loaded:** Everything is running. If Unity crashes, freezes, or unloads, heartbeat detects it within 2 echo cycles.

---

## 6. Failure Scenarios

### Unity Unloads (Application.Unload)
```
Native "playerUnloaded" event
  → failureMode = 'unloaded' + spinner
  → Heartbeat Echo fails (Unity gone)
  → 2 failures → error modal (restartable)
  → User can tap "Restart" → staged unmount restart
```

### Unity Quits (Application.Quit / hard crash)
```
Native "playerQuit" event
  → failureMode = 'quit' + spinner
  → unityRuntimeState.quitInProcess = true (persists across remounts)
  → Heartbeat fails → error modal (non-restartable)
  → User can only "Skip"
```

### Unity Freezes (no native event)
```
No event — Unity stops responding silently
  → Heartbeat Echo gets no reply
  → 1st failure → spinner
  → 2nd failure → error modal
```

### Unity Never Boots
```
RNUnityView mounted but UnityStarted never arrives
  → 30s startup timeout fires
  → error modal (non-restartable)
```

### Config Never Loads
```
UnityStarted received, heartbeat running, but LoadConfigFile hangs
  → Unity still responds to Echo (alive but stuck)
  → 30s config load timeout fires
  → error modal (non-restartable)
```

### Unity Previously Quit (re-entering activity)
```
unityRuntimeState.quitInProcess = true from earlier quit
  → On remount, detects prior quit
  → Shows spinner + starts heartbeat probe
  → If Unity somehow recovered → heartbeat succeeds → continue
  → If still dead → heartbeat fails → error modal
```

> **Note:** Only a native `Application.Quit` / hard crash sets `quitInProcess = true`. Timeout-based failures (startup, config load) do **not** — so re-entering a Unity activity after a timeout will attempt a fresh start.

---

## 7. Architecture

### File Structure

```
src/entities/unity/
  lib/
    constants.ts                    # Timing configuration
    types/
      unityType.ts                  # Shared types (UnityFailureMode, etc.)
      unityMessage.ts               # Unity message event constants
    hook/
      useUnityLifecycle.ts          # All lifecycle logic (timers, handlers, effects)
      useUnityHeartbeat.ts          # Echo heartbeat interval + failure detection
      useUnityFailureHandler.ts     # Failure state, modal visibility, flow skip
      useRNUnityCommBridge.ts       # Bidirectional messaging with Unity
  ui/
    UnityView.tsx                   # Thin render component (~100 lines)
    UnityErrorModal.tsx             # Modal UI (Figma design)
```

### Constants

| Constant | Value | Purpose |
|---|---|---|
| `HEARTBEAT_INTERVAL_MS` | 5000ms | Time between Echo pings |
| `HEARTBEAT_TIMEOUT_MS` | 3000ms | Max wait for a single Echo reply |
| `MAX_HEARTBEAT_FAILURES` | 2 | Consecutive failures before declaring death |
| `STARTUP_TIMEOUT_MS` | 30000ms | Max wait for `UnityStarted` after mount |
| `CONFIG_LOAD_TIMEOUT_MS` | 30000ms | Max wait for `LoadConfigFile` response |

### Hook Dependency Chain

```
UnityView
  └── useUnityLifecycle
        ├── useRNUnityCommBridge  (message bridge)
        ├── useUnityHeartbeat     (echo monitoring)
        └── useUnityFailureHandler (error state + modal)
```

---

## 8. Commit History

| Commit | Description |
|---|---|
| `83504ad5` | Remove backup Echo useEffect that caused premature config loading |
| `d945443e` | Remove 5s setTimeout delay in handleUnityReady |
| `a233e5ef` | Add periodic heartbeat Echo after UnityStarted |
| `542e557b` | Extract Unity heartbeat logic to useUnityHeartbeat hook |
| `e1626aa4` | Detect consecutive heartbeat failures |
| `6a4b0608` | Add Unity error modal and failure handling |
| `1641dda3` | Wire onError through ActivityItem and ActivityStepper |
| `579f7afa` | Add logging |
| `c4b319d2` | Extract failure handling into useUnityFailureHandler hook |
| `da46a2f6` | Add spinner overlay on first heartbeat failure |
| `b03e0a55` | Handle Unity failure in activity flows — skip to next activity |
| `8248fa43` | Handle Unity quit/unload recovery flow |
| `57cc78a9` | Add restartable error modal with staged unmount restart |
| `76b014b4` | Conditionally trigger failure on unload based on heartbeat state |
| `25bfd13d` | Remove verbose logs |
| `437e5ead` | Extract hook types to unityType.ts |
| `ea31d5a6` | Add startup and config load timeouts, start heartbeat before LoadConfigFile |
| `4f205a65` | Extract useUnityLifecycle hook from UnityView |

---

## 9. FAQ

### Why can't Unity restart after `Application.Quit`?

Per Unity's official [Unity as a Library (iOS)](https://docs.unity3d.com/6000.0/Documentation/Manual/UnityasaLibrary-iOS.html) documentation:

- **`quitApplication:`** — *"Unity will release all memory. Note: You won't be able to run Unity again in the same process after this call."*
- **`unloadApplication:`** — *"Unity will release most of the memory it occupies, but not all of it. You will be able to run Unity again."*

`Quit` tears down the Unity runtime (IL2CPP VM, native plugins, static state, GPU resources) irreversibly. Since iOS doesn't allow apps to restart their own process, Unity cannot re-bootstrap within the same app session. That's why `quit` failures are non-restartable — the user can only skip.

`Unload` keeps the UnityFramework resident in memory, so remounting the native view can wake Unity back up — that's why `unloaded` failures offer a "Restart" button.
