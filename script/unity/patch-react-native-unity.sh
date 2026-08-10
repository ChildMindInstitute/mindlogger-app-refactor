#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules
# For example:
# $ ./script/unity/patch-react-native-unity.sh ./node_modules/@azesmway/react-native-unity

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PKG_DIR=$(cd "$1" && pwd)

# RN 0.85 Fabric: updateProps is not reliably called, so Unity never initializes.
# This patch adds [self initUnityModule] to the new arch initWithFrame, matching
# the old arch behavior.
echo "[Unity][Patch react-native-unity] Patching RNUnityView.mm (Fabric init fix) ..."
cd "$PKG_DIR/ios"
patch --forward -p0 < $SCRIPT_DIR/react-native-unity-ios-fabric-init.patch || [ $? -eq 1 ]
