# Patches

Applied via [patch-package](https://github.com/ds300/patch-package).

## react-native+0.85.3.patch

- Scroll `ScrollView` to cursor when multiline `TextInput` grows while typing.
- Added in pull request #1183.
- Same fix as pull request facebook/react-native#58520.
- Remove after upgrading to react-native version that incorporates upstream fix.

## @azesmway+react-native-unity+1.1.1.patch

- Keeps the Unity engine alive across activity mounts.
- Prevents Unity events from being coalesced and dropped.
- Added in pull request #1155 and #1170.

## moti+0.30.0.patch

- Use `Pressable` from react-native-gesture-handler for `MotiPressable`.
- Added in pull request #1155.
