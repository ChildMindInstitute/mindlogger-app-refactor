#!/bin/sh

# Run this script with path to the react-native-unity package in node_modules
# For example:
# $ ./script/unity/unlink-react-native-unity.sh ./node_modules/@azesmway/react-native-unity

echo "[Unity][Unlink react-native-unity] Commenting out source_files from podspec ..."
sed '/^[[:space:]]*[^#][[:space:]]*s\.source_files/ s/^\([[:space:]]*\)/\1#/' \
  $1/react-native-unity.podspec > $1/react-native-unity.podspec.tmp \
  && mv $1/react-native-unity.podspec.tmp $1/react-native-unity.podspec

echo "[Unity][Unlink react-native-unity] Commenting out vendored_frameworks from podspec ..."
sed '/^[[:space:]]*[^#][[:space:]]*s\.vendored_frameworks/ s/^\([[:space:]]*\)/\1#/' \
  $1/react-native-unity.podspec > $1/react-native-unity.podspec.tmp \
  && mv $1/react-native-unity.podspec.tmp $1/react-native-unity.podspec

echo "[Unity][Unlink react-native-unity] Disabling android build support ..."
if [ -d $1/android ]; then mv $1/android $1/android.disabled; fi
