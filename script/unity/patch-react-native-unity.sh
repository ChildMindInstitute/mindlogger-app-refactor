#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules,
# plus the path to the patch file
# For example:
# $ ./script/unity/patch-react-native-unity.sh ./node_modules/@azesmway/react-native-unity ./react-native-unity.patch

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "[Unity][Patch react-native-unity] Patching UPlayer.java ..."
if [ -d $1/android.disabled ]; then
  cd $1/android.disabled/src/main/java/com/azesmwayreactnativeunity
else
  cd $1/android/src/main/java/com/azesmwayreactnativeunity
fi
patch --forward -p0 < $2 || [ $? -eq 1 ]

# RN 0.85 Fabric: updateProps is not reliably called, so Unity never initializes.
# This patch adds [self initUnityModule] to the new arch initWithFrame, matching
# the old arch behavior.
echo "[Unity][Patch react-native-unity] Patching RNUnityView.mm (Fabric init fix) ..."
cd $1/ios
patch --forward -p0 < $SCRIPT_DIR/react-native-unity-ios-fabric-init.patch || [ $? -eq 1 ]
