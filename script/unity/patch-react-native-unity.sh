#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules
# For example:
# $ ./script/unity/patch-react-native-unity.sh ./node_modules/@azesmway/react-native-unity

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PKG_DIR=$(cd "$1" && pwd)

# react-native-unity 1.1.1: Pause instead of unload Unity to avoid crash on reload (M2-10980).
echo "[Unity][Patch react-native-unity] Patching ReactNativeUnity.java (pause Unity fix) ..."
if [ -d "$PKG_DIR/android.disabled" ]; then
  cd "$PKG_DIR/android.disabled/src/main/java/com/azesmwayreactnativeunity"
else
  cd "$PKG_DIR/android/src/main/java/com/azesmwayreactnativeunity"
fi
patch --forward -p0 < $SCRIPT_DIR/react-native-unity-android-pause.patch || [ $? -eq 1 ]

# RN 0.85 Fabric: updateProps is not reliably called, so Unity never initializes.
# This patch adds [self initUnityModule] to the new arch initWithFrame, matching
# the old arch behavior.
echo "[Unity][Patch react-native-unity] Patching RNUnityView.mm (Fabric init fix) ..."
cd "$PKG_DIR/ios"
patch --forward -p0 < $SCRIPT_DIR/react-native-unity-ios-fabric-init.patch || [ $? -eq 1 ]
