#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "[PostInstall] Entering $SCRIPT_DIR ..."
cd "$SCRIPT_DIR"

echo "[PostInstall] Running yarn patch-package ..."
yarn patch-package

# if BUILD_UNITY is unset, unlink from build
if [ -z "${BUILD_WITH_UNITY+x}" ]; then
  echo "[PostInstall] Running unity/unlink-react-native-unity.sh ..."
  ./unity/unlink-react-native-unity.sh $SCRIPT_DIR/../node_modules/@azesmway/react-native-unity
#else
#  echo "[PostInstall] Running unity/relink-react-native-unity.sh ..."
fi
