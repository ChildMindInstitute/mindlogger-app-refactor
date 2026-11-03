# Patches

Applied via [patch-package](https://github.com/ds300/patch-package).

## react-native+0.85.3.patch

- Disable font leading in multiline `TextInput` (similar to react/react-native#45268).
- Scroll as multiline `TextInput` grows in iOS (same fix as react/react-native#58520).
- Added in pull request #1183.

## @azesmway+react-native-unity+1.1.1.patch

- Prevents Unity events from being coalesced and dropped.
- Keeps the Unity engine alive across activity mounts.
- Pauses the Unity engine before moving the Unity view off-screen on Android.
- Restores navigation bar and portrait orientation while Unity is paused on Android.
- Added in pull requests #1155, #1164, #1170, #1193, and #1216.

## moti+0.30.0.patch

- Use `Pressable` from react-native-gesture-handler for `MotiPressable`.
- Added in pull request #1155.
