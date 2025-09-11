#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "[PostInstall] Entering $SCRIPT_DIR ..."
cd "$SCRIPT_DIR"

echo "[PostInstall] Running yarn patch-package ..."
yarn patch-package

if [ -n "${BUILD_UNITY}"]; then
  echo "[PostInstall] Running unity/unlink-react-native-unity.sh ..."
  ./unity/unlink-react-native-unity.sh $SCRIPT_DIR/../node_modules/@azesmway/react-native-unity
else
  echo "[PostInstall] Running unity/relink-react-native-unity.sh ..."
  ./unity/relink-react-native-unity.sh $SCRIPT_DIR/../node_modules/@azesmway/react-native-unity
fi

# We can't use patch-package to patch @azesmway/react-native-unity because
# the above unlinking script would change the path of the android source
# directory in the package, and that would cause patch-package to fail.
echo "[PostInstall] Running unity/patch-react-native-unity.sh ..."
./unity/patch-react-native-unity.sh $SCRIPT_DIR/../node_modules/@azesmway/react-native-unity \
  $SCRIPT_DIR/unity/react-native-unity.patch
