# Local Push Notification Testing

Guide for sending push notifications to the iOS Simulator to test the MindLogger notification handling flow.

## Overview

MindLogger uses push notifications to remind users about scheduled activities. Testing the notification tap behavior requires sending actual push payloads to the iOS Simulator using `xcrun simctl push`. A helper script is provided at `script/send_local_push_notification/` to simplify this process.

## Setup

1. Start the iOS Simulator with the dev build:
   ```bash
   yarn ios:dev
   ```

2. Grant notification permissions when prompted (or via Settings > Notifications > MindLogger in the simulator).

3. Make the script executable (first time only):
   ```bash
   chmod +x script/send_local_push_notification/send-notification.sh
   ```

## Usage

### Send a test notification

```bash
# Default payload (unassigned activity)
./script/send_local_push_notification/send-notification.sh

# Custom payload
./script/send_local_push_notification/send-notification.sh script/send_local_push_notification/payloads/apns-full.json

# Debug mode (verifies app install, terminates app, sends simple + full notification)
./script/send_local_push_notification/send-notification.sh --debug
```

### Available payloads

| Payload | Use Case |
|---------|----------|
| `payloads/unassigned-activity.json` | Tests notification for an unassigned activity (`targetSubjectId: null`). Tapping should open the applet without auto-starting the activity. |
| `payloads/apns-full.json` | Full APNS payload with Firebase fields. Simulates a real FCM-delivered notification. |

### Creating your own payload

Copy one of the existing payloads and replace the UUIDs with values from your test environment:

```bash
cp script/send_local_push_notification/payloads/unassigned-activity.json \
   script/send_local_push_notification/payloads/my-test.json
# Edit my-test.json with your appletId, activityId, eventId
```

You can find the correct UUIDs using Reactotron (see [ReactotronSetup.md](./ReactotronSetup.md)) by inspecting the Redux state under the applets and events slices.

## Notification Handling Architecture

When a user taps a notification, the app processes it through:

1. **`useOnNotificationTap`** (`src/features/tap-on-notification/model/hooks/useOnNotificationTap.ts`) - Entry point that extracts notification data and calls the validation pipeline.

2. **`checkEntityAvailability`** (`src/screens/model/checkEntityAvailability.ts`) - Central 6-stage validation:
   - Assignment validation (is the user assigned to this activity?)
   - In-progress check (is there an existing session?)
   - Autocompletion check
   - Event validation (is the eventId still valid?)
   - Available/Scheduled group evaluation
   - Completion check (has it been completed today?)

3. **Toast alerts** (`src/features/tap-on-notification/lib/alerts.ts`) - User feedback when an activity cannot be started (completed, not assigned, not available, etc.).

### Key behavior differences

| Scenario | Notification Tap Result |
|----------|------------------------|
| Assigned + available activity | Opens and auto-starts the activity |
| Unassigned activity | Opens the applet (user must manually start) |
| Completed activity | Shows "already completed" toast |
| Activity outside schedule | Shows "not available" toast |
| Stale eventId | Attempts to find current event for the entity |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No notification appears | Check notification permissions in simulator Settings |
| Script says "No booted simulator" | Run `yarn ios:dev` first |
| Notification tap does nothing | Verify UUIDs match real data for the logged-in user |
| "Activity not available" toast | Activity may be completed, outside schedule, or not assigned |
| Need to test background state | Use `--debug` flag (terminates app before sending) |
