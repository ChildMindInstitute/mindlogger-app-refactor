# Unity Integration

Integration with Unity is implemented by `https://github.com/azesmway/react-native-unity`,
which renders a Unity scene from an export from the Unity project.

The `react-native-unity` also has some limitations related to iOS Simulator
compatibility and requirements for exporting the Unity project itself.

## Compatibility Issues and Unity Export Requirements

### iOS Concerns

The `react-native-unity` package is NOT compatible with the iOS Simulator. This
means any testing with a version of the app built with Unity assets must be
done using a real device.

The `UnityFramework.framework` for iOS exported from Unity is portable. This
means the export can be made anywhere and would still be usable to create an
iOS build with Unity assets. This also means the machine that's creating the
iOS build do not need to have Unity installed.

### Android Concerns

The `react-native-unity` package is compatible with the Android emulator.

The Android export of the Unity project is NOT portable. This means in order to
create an Android build with Unity assets, the Android export must be done on
the same machine that's performing the build for the app (and thus Unity must
also be installed on that machine).

## Link/Unlink Utilities and Procedures

Due to the aforementioned concerns with iOS and Android, certain precaution
are taken to ensure by defualt the app is not built with Unity assets. This
would allow any developers not working on Unity related tasks to continue to
use any simulator/emulator without any issues.

The `postinstall` script in `package.json` is updated to run a script to
"unlink" Unity assets from the app's build process:

* the `source_files` and `vendored_frameworks` attributes are commented out
  from `react-native-unity`'s podspec file
  * this excludes Unity assets from the iOS build
* the `android` directory inside `react-native-unity` is renamed to
  `android.disabled`
  * this excludes Untiy assets from the Android build

The `postinstall` script also includes an automatic patch to update the
`UPlayer.java` inside `react-native-unity` to ensure compatibility with Unity 6
(see https://github.com/azesmway/react-native-unity/issues/123#issuecomment-2508887728).

## Building with Unity Assets

To build with Unity assets, first ensure Unity exports are placed in the
correct locations:

* Place the iOS export `UnityFramework.framework` at
  `<repo>/unity/build/ios/UnityFramework.framework`
  * The iOS export must be made with a minimal iOS version of `15.6`
* Place the Android export (it's just a directory) at `<repo>/unity/build/android`

Run the follow commands to prepare the build:

```
$ yarn
$ yarn clean
$ ./script/unity/relink-react-native-unity.sh ./node_modules/@azesmway/react-native-unity
$ yarn pods:reinstall
```

... the `yarn` (i.e. `yarn install`) command will trigger the `postinstall`
which will "unlink" the Unity assets from the build. This is why we have to
also run the `relink-react-native-unity.sh` script to relink them.

To build for iOS, run: `$ yarn ios`.

To build for Android, run: `$ yarn android`.

## Building without Unity Assets

Run the follow commands to prepare the build:

```
$ yarn
$ yarn clean
$ yarn pods:reinstall
```

... the `yarn` (i.e. `yarn install`) command will trigger the `postinstall`
which will "unlink" the Unity assets from the build.

To build for iOS, run: `$ yarn ios`.

To build for Android, run: `$ yarn android`.
