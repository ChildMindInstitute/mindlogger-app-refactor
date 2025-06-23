# Unity Integration

Integration with Unity is implemented by `https://github.com/azesmway/react-native-unity`,
which renders a Unity scene from an export from the Unity project.

The `react-native-unity` also has some limitations related to iOS Simulator
compatibility and requirements for exporting the Unity project itself.

## Compatibility Issues and Unity Export Requirements

### iOS Concerns

The `react-native-unity` package is NOT compatible with the iOS Simulator. This
means any testing with a version of the app built with Unity artifacts must be
done using a real device.

The `UnityFramework.framework` for iOS exported from Unity is portable. This
means the export can be made anywhere and would still be usable to create an
iOS build with Unity artifacts. This also means the machine that's creating the
iOS build do not need to have Unity installed.

### Android Concerns

The `react-native-unity` package is compatible with the Android emulator.

The Android export of the Unity project is NOT portable. This means in order to
create an Android build with Unity artifacts, the Android export must be done
on the same machine that's performing the build for the app (and thus Unity
must also be installed on that machine).

## Link/Unlink Utilities and Procedures

Due to the aforementioned concerns with iOS and Android, certain precaution
are taken to ensure by defualt the app is not built with Unity artifacts. This
would allow any developers not working on Unity related tasks to continue to
use any simulator/emulator without any issues.

The `postinstall` script in `package.json` is updated to run a script to
"unlink" Unity artifacts from the app's build process:

* the `source_files` and `vendored_frameworks` attributes are commented out
  from `react-native-unity`'s podspec file
  * this excludes Unity artifacts from the iOS build
* the `android` directory inside `react-native-unity` is renamed to
  `android.disabled`
  * this excludes Untiy artifacts from the Android build

The `postinstall` script also includes an automatic patch to update the
`UPlayer.java` inside `react-native-unity` to ensure compatibility with Unity 6
(see https://github.com/azesmway/react-native-unity/issues/123#issuecomment-2508887728).

## Building with Unity Artifact

Before the app can be built, prepare iOS and Android platform specific
artifacts:

**iOS Artifact**

1. Open the Unity project in Unity 6
2. Create an iOS export
   * The iOS export must be made with a minimal iOS version of `15.6`
3. Open and build the exported XCode project
4. Set Target Membership of the `Data` directory to `UnityFramework`
5. Set Header Visibility of `Libraries/Plugins/iOS/NativeCallProxy` to `Public`
6. Build the `UnityFramework` product
7. Place the built `UnityFramework.framework` at `<repo>/unity/build/ios/UnityFramework.framework`

**Android Artifact**

1. Open the Unity project in Unity 6
2. Create an Andriod export
   * Ensure the `Export Project` checkbox is checked
   * In "Player Settings":
     * Set "Scripting Backend" to `IL2CPP`
     * Set "Target Architecture" to ONLY `ARM64`
3. Place the Android export at `<repo>/unity/build/android`

**Build Mobile App**

Run the follow commands to prepare the build:

```
$ yarn
$ yarn clean
$ yarn unity:relink
$ yarn pods:reinstall
```

... the `yarn` (i.e. `yarn install`) command will trigger the `postinstall`
which will "unlink" the Unity artifacts from the build. This is why we have to
also run the `relink-react-native-unity.sh` script to relink them.

To build for iOS, run: `$ yarn ios`.

To build for Android, run: `$ yarn android`.

## Building without Unity Artifact

Run the follow commands to prepare the build:

```
$ yarn
$ yarn clean
$ yarn pods:reinstall
```

... the `yarn` (i.e. `yarn install`) command will trigger the `postinstall`
which will "unlink" the Unity artifacts from the build.

To build for iOS, run: `$ yarn ios`.

To build for Android, run: `$ yarn android`.
