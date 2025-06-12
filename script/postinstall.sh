#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "[PostInstall] Entering $SCRIPT_DIR ..."
cd "$SCRIPT_DIR"

echo "[PostInstall] Running yarn patch-package ..."
yarn patch-package

echo "[PostInstall] Running unity/unlink-react-native-unity.sh ..."
./unity/unlink-react-native-unity.sh $SCRIPT_DIR/../node_modules/@azesmway/react-native-unity
