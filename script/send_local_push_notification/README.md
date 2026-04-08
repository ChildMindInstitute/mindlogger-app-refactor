# Send Local Push Notification

Send push notifications to the iOS Simulator for testing notification-related features in MindLogger.

## Prerequisites

- macOS with Xcode command line tools (`xcrun simctl`)
- A booted iOS Simulator running the MindLogger dev build (`yarn ios:dev`)
- Notification permissions granted in the app

## Quick Start

```bash
# Make the script executable (first time only)
chmod +x script/send_local_push_notification/send-notification.sh

# Send the default test notification (unassigned activity)
./script/send_local_push_notification/send-notification.sh

# Send a specific payload
./script/send_local_push_notification/send-notification.sh script/send_local_push_notification/payloads/apns-full.json

# Debug mode: checks app install, terminates app, sends simple + full notification
./script/send_local_push_notification/send-notification.sh --debug
```

## Payloads

| File | Description |
|------|-------------|
| `payloads/unassigned-activity.json` | Notification for an unassigned activity (`targetSubjectId: null`). Used to verify that tapping opens the applet without auto-starting the activity. |
| `payloads/apns-full.json` | Full APNS-format payload with Firebase fields (`gcm.message_id`, `google.c.sender.id`, `mutable-content`). Simulates a real Firebase Cloud Messaging notification. |

## Creating Custom Payloads

Create a JSON file with the standard MindLogger notification fields:

```json
{
  "aps": {
    "alert": {
      "title": "Your notification title",
      "body": "Your notification body"
    },
    "sound": "default",
    "badge": 1
  },
  "type": "schedule-event-alert",
  "appletId": "<applet-uuid>",
  "activityId": "<activity-uuid>",
  "eventId": "<event-uuid>",
  "entityName": "Activity Name",
  "targetSubjectId": null
}
```

Replace the UUIDs with real values from your test environment. You can find these in the API responses or in the app's Redux state via Reactotron.

### Key Fields

| Field | Description |
|-------|-------------|
| `type` | Always `"schedule-event-alert"` for activity reminders |
| `appletId` | UUID of the applet containing the activity |
| `activityId` | UUID of the specific activity |
| `eventId` | UUID of the scheduled event |
| `entityName` | Display name shown in notification |
| `targetSubjectId` | `null` for unassigned, or a subject UUID for assigned activities |
| `isLocal` | `"true"` for locally scheduled notifications |

## How It Works

1. The script finds the currently booted iOS Simulator using `xcrun simctl list devices`
2. It targets the dev bundle ID: `lab.childmindinstitute.data.dev`
3. It sends the JSON payload using `xcrun simctl push`
4. The app's notification handler (`useOnNotificationTap`) processes the notification through the `checkEntityAvailability` validation pipeline

## Relevant Source Code

- **Notification handler**: `src/features/tap-on-notification/model/hooks/useOnNotificationTap.ts`
- **Validation pipeline**: `src/screens/model/checkEntityAvailability.ts`
- **Toast alerts**: `src/features/tap-on-notification/lib/alerts.ts`

## Troubleshooting

- **No notification appears**: Ensure the app has notification permissions (Settings > Notifications > MindLogger)
- **App not found**: Run `yarn ios:dev` to install the dev build on the simulator
- **Notification tap does nothing**: Check that the UUIDs in the payload match real entities in the currently logged-in user's data
- **"Activity not available" toast**: The validation pipeline determined the activity is completed, not scheduled, or not assigned to the current user
