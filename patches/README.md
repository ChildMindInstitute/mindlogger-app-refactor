# Patches

Applied via [patch-package](https://github.com/ds300/patch-package).

## react-native+0.85.3.patch

- Disable font leading in multiline `TextInput` (similar to react/react-native#45268).
- Scroll as multiline `TextInput` grows in iOS (same fix as react/react-native#58520).
- Include trailing newline in multiline `TextInput` height in iOS.
- Added in pull request #1183.

## @azesmway+react-native-unity+1.1.1.patch

- Keeps the Unity engine alive across activity mounts.
- Prevents Unity events from being coalesced and dropped.
- Added in pull request #1155 and #1170.

## moti+0.30.0.patch

- Use `Pressable` from react-native-gesture-handler for `MotiPressable`.
- Added in pull request #1155.
