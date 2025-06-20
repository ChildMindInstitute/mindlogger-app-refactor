#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules,
# plus the path to the patch file
# For example:
# $ ./script/unity/patch-react-native-unity.sh ./node_modules/@azesmway/react-native-unity ./react-native-unity.patch

echo "[Unity][Patch react-native-unity] Patching UPlayer.java ..."
if [ -d $1/android.disabled ]; then
  cd $1/android.disabled/src/main/java/com/azesmwayreactnativeunity
else
  cd $1/android/src/main/java/com/azesmwayreactnativeunity
fi
patch --forward -p0 < $2 || [ $? -eq 1 ]
