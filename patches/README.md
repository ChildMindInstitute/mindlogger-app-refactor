# Patches

Applied via [patch-package](https://github.com/ds300/patch-package).

## ~react-native+0.81.6.patch~ (removed)

Bumps `fmt` dependency 11.0.2 → 12.1.0 to fix iOS compile errors with Xcode 26.4.

- Resolves issue facebook/react-native#55601.
- Added in commit 5d8a43ca of pull request #1084.
- Removed after upgrading to react-native 0.85.2, which incorporates the fix.

## ~react-native-reanimated+3.17.5.patch~ (removed)

Fixed `endLayoutAnimation` causing Android buttons to become unclickable.

- Resolved issue software-mansion/react-native-reanimated#7440.
- Added in commit b73d8a0 of pull request #986.
- Removed after upgrading to react-native-reanimated 3.19.5, which incorporates the fix.
