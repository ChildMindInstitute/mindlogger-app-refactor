#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules
# For example:
# $ ./script/unity/relink-react-native-unity.sh ./node_modules/@azesmway/react-native-unity

echo "[Unlink react-native-unity] Uncommenting in source_files from podspec ..."
sed '/^[[:space:]]*#[[:space:]]*s\.source_files/ s/^\([[:space:]]*\)#[[:space:]]*/\1/' \
  $1/react-native-unity.podspec > $1/react-native-unity.podspec.tmp \
  && mv $1/react-native-unity.podspec.tmp $1/react-native-unity.podspec

echo "[Unlink react-native-unity] Uncommenting in vendored_frameworks from podspec ..."
sed '/^[[:space:]]*#[[:space:]]*s\.vendored_frameworks/ s/^\([[:space:]]*\)#[[:space:]]*/\1/' \
  $1/react-native-unity.podspec > $1/react-native-unity.podspec.tmp \
  && mv $1/react-native-unity.podspec.tmp $1/react-native-unity.podspec

echo "[Unlink react-native-unity] Enabling android build support ..."
[ -d $1/android.disabled ] && mv $1/android.disabled $1/android
