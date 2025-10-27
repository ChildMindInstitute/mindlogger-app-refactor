# Reactotron Setup and Usage Guide

## Overview

Reactotron is a powerful debugging tool integrated into the MindLogger Mobile app for development purposes. It provides real-time visibility into:

- **Redux State & Actions**: Track all Redux actions and state changes
- **MMKV Storage**: Monitor all storage read/write operations across all instances
- **Network Requests**: View complete HTTP request/response data
- **Errors & Warnings**: See errors and warnings with on-screen overlay
- **Performance Metrics**: Track request timing and app performance

> **Important**: Reactotron is **only enabled in dev builds** (`ENV=dev`) for security and performance reasons.

---

## Installation

### 1. Install Reactotron Desktop App

Download and install the Reactotron desktop application:

| Platform | Download Link                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------- |
| macOS    | [GitHub Releases](https://github.com/infinitered/reactotron/releases)                          |
| Windows  | [GitHub Releases](https://github.com/infinitered/reactotron/releases)                          |
| Linux    | [GitHub Releases](https://github.com/infinitered/reactotron/releases)                          |

Or install via Homebrew on macOS:

```bash
brew install --cask reactotron
```

### 2. Configure Network Connection

#### iOS Simulator

No additional configuration needed. Reactotron will connect automatically.

#### Android Emulator

Run the following command to forward the Reactotron port:

```bash
adb reverse tcp:9090 tcp:9090
```

#### Physical Devices

Update the Reactotron configuration to use your computer's IP address:

**File**: `src/shared/config/reactotron.config.ts`

```typescript
reactotron = Reactotron.configure({
  name: 'MindLogger Mobile',
  host: '192.168.1.XXX', // Replace with your computer's IP
})
```

> **Find your computer's IP:**
> - **macOS**: System Preferences → Network
> - **Windows**: Run `ipconfig` in Command Prompt
> - **Linux**: Run `ip addr` or `ifconfig`

---

## Usage

### Starting the App with Reactotron

1. **Start Reactotron Desktop App**
   - Launch Reactotron before running the app
   - Leave it running in the background

2. **Run Dev Build**

```bash
# iOS
yarn ios:dev

# Android
yarn android:dev
```

3. **Verify Connection**
   - You should see "MindLogger Mobile" appear in Reactotron
   - Console will log: `[Reactotron] Connected successfully`

---

### Features and Tabs

#### Timeline Tab

Shows a chronological view of all events:

- Redux actions
- Network requests
- Storage operations
- Custom logs
- Errors and warnings

**Filtering**: Use the search bar to filter events by type or content.

#### State Tab

Displays the current Redux state tree:

- Navigate through state structure
- Search for specific state keys
- View state values in real-time
- Subscribe to specific state slices

**Snapshots**: Click "Snapshot" to save current state for comparison.

#### Redux Actions

View all dispatched Redux actions:

- Action type and payload
- State before and after
- Time and duration
- Stack trace (if applicable)

**Dispatching Actions**: Use the "Dispatch" feature to manually trigger Redux actions for testing.

#### API Tab

Monitor all network requests:

- Request method, URL, headers, body
- Response status, headers, body
- Request timing and duration
- Error details for failed requests

**Features**:

- Click any request to see full details
- Authorization headers are filtered (shows "Bearer ***")
- Failed requests highlighted in red

#### Storage Tab (MMKV)

Track all MMKV storage operations:

- All registered storage instances
- Read/write operations
- Current storage values
- Storage keys and their data

**Tracked Instances**:

- `redux-storage` - Redux persist storage
- `localization-storage` - Language/translation data
- Any dynamically created storage instances

**Sensitive Data**: Some keys are filtered (tokens, passwords, encryption keys).

#### Custom Logs

Use Reactotron logging in your code:

```typescript
import Reactotron from '@shared/config/reactotron.config';

// Standard log
Reactotron.log?.('Debug message');

// Important log (highlighted)
Reactotron.logImportant?.('Critical information');

// Warning
Reactotron.warn?.('Warning message');

// Error
Reactotron.error?.('Error details');

// Custom display
Reactotron.display?.({
  name: 'Custom Event',
  preview: 'Preview text',
  value: { any: 'data' },
  important: true,
});
```

---

## Configuration

### Environment Gating

Reactotron is automatically disabled in non-dev environments. The configuration checks:

```typescript
if (Config.ENV === 'dev') {
  // Reactotron enabled
} else {
  // No-op implementation
}
```

| Build Variant | Reactotron Enabled? |
| ------------- | ------------------- |
| ✅ dev        | Yes                 |
| ❌ qa         | No                  |
| ❌ staging    | No                  |
| ❌ uat        | No                  |
| ❌ production | No                  |

### Sensitive Data Filtering

The following data is automatically filtered from Reactotron logs:

| Category          | Filtered Data                          |
| ----------------- | ------------------------------------ |
| Network Requests  | Authorization headers → "Bearer ***" |
| MMKV Storage      | `STORE_ENCRYPTION_KEY`, `accessToken`, `refreshToken`, `password`, `secret` |

### Customizing Configuration

Edit `src/shared/config/reactotron.config.ts` to customize:

**Overlay Settings:**

```typescript
.useReactNative({
  overlay: true, // Show error overlay
  errors: {
    veto: () => false, // Show all errors (or filter)
  },
})
```

**Network Filtering:**

```typescript
networking: {
  ignoreUrls: /symbolicate|logs|inspector|YOUR_PATTERN/,
}
```

**Storage Filtering:**

Edit `src/shared/lib/storages/ReactotronMMKVTracker.ts`:

```typescript
ignore: [
  'STORE_ENCRYPTION_KEY',
  'accessToken',
  'YOUR_SENSITIVE_KEY',
],
```

---

## Troubleshooting

### Reactotron Not Connecting

**Problem**: App runs but Reactotron doesn't show connection.

**Solutions**:

1. Verify Reactotron desktop app is running.
2. Check that you're running a dev build (`yarn ios:dev` / `yarn android:dev`).
3. For Android emulator, run: `adb reverse tcp:9090 tcp:9090`.
4. For physical devices, verify IP address in config matches your computer.
5. Check firewall settings (allow port 9090).
6. Restart both the app and Reactotron desktop.

### No Network Requests Showing

**Problem**: Timeline shows Redux actions but not network requests.

**Solutions**:

1. Verify network tracking job is loaded (check console for: `[Reactotron] Network tracking configured`).
2. Ensure requests are going through `httpService` instance.
3. Check that requests aren't being filtered by `ignoreUrls` pattern.
4. Look in Timeline tab, not just API tab.

### Redux State Not Updating

**Problem**: State tab shows stale data.

**Solutions**:

1. Click the refresh icon in State tab.
2. Verify Redux enhancer is loaded (check Redux tab for actions).
3. Restart the app.
4. Check that `Config.ENV === 'dev'`.

### Storage Operations Not Appearing

**Problem**: MMKV operations not showing in Reactotron.

**Solutions**:

1. Verify storage instances are being registered (check console logs).
2. Check that operations aren't filtered by `ignore` list.
3. Ensure storage is created via `createStorage()` functions (not direct MMKV instantiation).
4. Restart app after configuration changes.

### Performance Issues

**Problem**: App feels slow with Reactotron connected.

**Solutions**:

1. Disable overlay if not needed: `overlay: false`.
2. Filter noisy network requests via `ignoreUrls`.
3. Reduce Redux action logging (filter in Reactotron UI).
4. Use Reactotron sparingly during performance testing.

### Port 9090 Already in Use

**Problem**: Cannot connect, port conflict.

**Solutions**:

1. Find process using port:

   - macOS/Linux: `lsof -i :9090`
   - Windows: `netstat -ano | findstr :9090`

2. Kill the process or change Reactotron port in config:

```typescript
Reactotron.configure({
  port: 9091, // Use different port
})
```

---

## Best Practices

### Development Workflow

1. **Start Reactotron first** before launching the app.
2. **Clear timeline** at the start of each debugging session.
3. **Use snapshots** to compare state at different points.
4. **Filter events** to focus on relevant information.
5. **Take screenshots** of interesting timelines for documentation.

### Debugging Strategies

| Area           | Tips                                                                                   |
| -------------- | -------------------------------------------------------------------------------------- |
| Redux Issues   | Watch Timeline for unexpected actions; compare state snapshots; dispatch test actions. |
| Network Issues | Check request timing; verify headers; examine response bodies; track failed requests.  |
| Storage Issues | Monitor writes; check for unexpected keys; verify JSON serialization; track instances. |
| Performance    | Measure request duration; identify slow reducers; track storage frequency; monitor memory usage. |

### Code Integration

**When to Log:**

```typescript
// ✅ Good: Important state transitions
Reactotron.logImportant?.('User logged in:', userId);

// ✅ Good: Debugging complex logic
Reactotron.display?.({
  name: 'Calculation Result',
  value: { input, output, intermediate },
});

// ❌ Bad: Excessive logging in loops
array.forEach(item => {
  Reactotron.log?.(item); // Don't do this
});

// ✅ Better: Summarize
Reactotron.log?.(`Processed ${array.length} items`);
```

**Performance Considerations:**

- Keep logging concise.
- Avoid logging large objects in hot paths.
- Use conditional logging for verbose output.
- Remember: Reactotron is only active in dev.

---

## Architecture

### Integration Points

| File                                    | Purpose                                          |
| --------------------------------------- | ------------------------------------------------|
| `index.js`                             | Import Reactotron first to ensure connection before Redux/MMKV initialization |
| `src/shared/config/reactotron.config.ts` | Main configuration and plugin setup (Redux, MMKV, networking), environment gating |
| `src/app/ui/AppProvider/ReduxProvider.tsx` | Redux store enhancer integration for action/state tracking |
| `src/shared/lib/storages/createStorage.ts` | MMKV instance registration and automatic tracking |
| `src/jobs/reactotron-network-tracking.ts` | Axios interceptor setup for request/response logging |

### Data Flow

```text
App Start
  → Reactotron Config Loaded (index.js)
  → Reactotron Connects to Desktop
  → MMKV Instances Registered (as created)
  → Redux Store Created (with enhancer)
  → Network Tracking Job Runs (axios interceptors)
  → App Ready (all tracking active)
```

---

## Additional Resources

- [Reactotron Documentation](https://docs.infinite.red/reactotron/)
- [Reactotron GitHub](https://github.com/infinitered/reactotron)
- [Redux Plugin Docs](https://docs.infinite.red/reactotron/plugins/redux/)
- [MMKV Plugin Docs](https://docs.infinite.red/reactotron/plugins/react-native-mmkv/)

---

## Support

If you encounter issues with Reactotron integration:

1. Check this documentation first.
2. Review console logs for Reactotron-related messages.
3. Verify environment configuration (`Config.ENV`).
4. Check Reactotron GitHub issues for known problems.
5. Contact the development team for assistance.
