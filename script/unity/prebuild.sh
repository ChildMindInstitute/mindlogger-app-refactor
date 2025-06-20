#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "[Unity][Pre-build] Entering $SCRIPT_DIR ..."
cd "$SCRIPT_DIR"

echo "[Unity][Pre-build] Removing snapshotted UnityFramework.framework ..."
rm -fr $SCRIPT_DIR/../../node_modules/@azesmway/react-native-unity/ios/UnityFramework.framework

echo "[Unity][Pre-build] Removing <intent-filter /> from AndroidManifest.xml ..."
awk '/<intent-filter>/ {skip=1} !skip {print} /<\/intent-filter>/ {skip=0}' \
  $SCRIPT_DIR/../../unity/builds/android/unityLibrary/src/main/AndroidManifest.xml \
  > $SCRIPT_DIR/../../unity/builds/android/unityLibrary/src/main/AndroidManifest.xml.modified
mv $SCRIPT_DIR/../../unity/builds/android/unityLibrary/src/main/AndroidManifest.xml.modified \
  $SCRIPT_DIR/../../unity/builds/android/unityLibrary/src/main/AndroidManifest.xml
