#!/bin/bash

# MindLogger iOS Simulator Push Notification Sender
# Sends local push notifications to the iOS Simulator for testing notification-related features.
#
# Usage:
#   ./send-notification.sh                          # Send default test payload
#   ./send-notification.sh custom-payload.json      # Send custom payload
#   ./send-notification.sh --debug                  # Debug mode (checks app install, sends simple + full notification)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_ID="lab.childmindinstitute.data.dev"

# Find the booted simulator
BOOTED_DEVICE=$(xcrun simctl list devices | grep "Booted" | head -1 | sed -n 's/.*(\\([^)]*\\)).*(Booted).*/\\1/p')

if [ -z "$BOOTED_DEVICE" ]; then
    echo "No booted iOS simulator found."
    echo "Start the simulator first: yarn ios:dev"
    exit 1
fi

echo "Device: $BOOTED_DEVICE"
echo "Bundle: $BUNDLE_ID"
echo ""

# Debug mode
if [ "${1:-}" = "--debug" ]; then
    echo "[Debug Mode]"
    echo ""

    # Check app installation
    echo "Checking app installation..."
    if xcrun simctl get_app_container booted "$BUNDLE_ID" &>/dev/null; then
        echo "  App is installed."
    else
        echo "  App is NOT installed. Run: yarn ios:dev"
        exit 1
    fi

    # Terminate app to test background/killed state
    echo "Terminating app (if running)..."
    xcrun simctl terminate "$BOOTED_DEVICE" "$BUNDLE_ID" &>/dev/null || true
    echo ""

    # Send simple notification first
    echo "Sending simple test notification..."
    SIMPLE_PAYLOAD='{"aps":{"alert":"Simple test notification","sound":"default","badge":1}}'
    echo "$SIMPLE_PAYLOAD" | xcrun simctl push "$BOOTED_DEVICE" "$BUNDLE_ID" -
    echo "  Sent. Waiting 3 seconds..."
    sleep 3
    echo ""

    # Send full notification
    echo "Sending MindLogger notification..."
    xcrun simctl push "$BOOTED_DEVICE" "$BUNDLE_ID" "$SCRIPT_DIR/payloads/unassigned-activity.json"
    echo "  Sent."
    echo ""

    echo "Troubleshooting:"
    echo "  1. Ensure notification permissions are granted in the app"
    echo "  2. App should be in background or killed state"
    echo "  3. Check Notification Center (swipe down from top)"
    echo "  4. Restart simulator if notifications don't appear"
    exit 0
fi

# Normal mode - send a payload
PAYLOAD="${1:-$SCRIPT_DIR/payloads/unassigned-activity.json}"

if [ ! -f "$PAYLOAD" ]; then
    echo "Payload file not found: $PAYLOAD"
    echo ""
    echo "Available payloads in $SCRIPT_DIR/payloads/:"
    ls "$SCRIPT_DIR/payloads/"*.json 2>/dev/null || echo "  (none)"
    exit 1
fi

echo "Sending: $(basename "$PAYLOAD")"
xcrun simctl push "$BOOTED_DEVICE" "$BUNDLE_ID" "$PAYLOAD"
echo "Notification sent."
