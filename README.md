# Child Mind Institute - Curious Mobile App

This repository is used for the respondent mobile app of the [Curious](https://mindlogger.org/) application stack.

## Application Stack

- Curious Admin - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-admin)
- Curious Backend - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-backend-refactor)
- Curious Mobile App - **This Repo**
- Curious Web App - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-web-refactor)

## Getting Started

Running the app:

### 1. Prerequisites

- NodeJS `20.10.0` or higher, recommend using `asdf` or `nvm` to manage local node version
- Yarn 1.x
- Follow steps in [React Native CLI Environment Setup](https://reactnative.dev/docs/environment-setup?guide=native), including:
  - Watchman
  - Xcode 16 (incl. Command Line Tools)
  - Java Development Kit
  - Android Studio
  - Android SDK
- [Backend](https://github.com/ChildMindInstitute/mindlogger-backend-refactor) project running locally or accessible in a test environment
- Configured [environment variables](#environment-variables):\
  `cp .env.example .env.dev`

### 2. Run the app

- Install Node dependencies using `yarn`
- Install CocoaPod dependencies using `yarn pods:install:bundler`
- Start Metro using `yarn start` (see [scripts](#available-scripts))
- Build and run either the iOS or Android app:
  - `yarn android` builds the Android app and runs in an Android emulator
  - `yarn ios` builds the iOS app and runs in an iOS simulator

## Features

See Curious's [Knowledge Base article](https://mindlogger.atlassian.net/servicedesk/customer/portal/3/topic/4d9a9ad4-c663-443b-b7fc-be9faf5d9383/article/337444910) to discover the Curious application stack's features.

## Technologies

- [TypeScript](https://www.typescriptlang.org/) - TypeScript is JavaScript with syntax for types
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [React Native](https://reactnative.dev/) - A JavaScript framework for building natively-rendered apps for iOS, Android, and web
- [Redux Toolkit](https://redux-toolkit.js.org/) - Global state manager for JavaScript applications
- [React Navigation](https://reactnavigation.org/) - A routing and navigation library for React Native
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - An animation library for creating smooth interactions running on the UI thread
- [Tamagui](https://tamagui.dev/) - A style library and component kit for React, supporting web, Android, and iOS
- [Axios](https://axios-http.com/) - A Promise-based HTTP client for JavaScript
- [Feature-Sliced Design](https://feature-sliced.design/) - Architectural methodology

## Available Scripts

In the project directory, you can run the following commands from the project root:

### Setup

- `yarn postinstall`

  Applies any preconfigured package patches & sets up iOS permissions.

- `yarn pods`

    Installs any native dependencies required by the iOS app via **CocoaPods**, a dependency management system used for iOS.

### Starting the Metro Server

- `yarn start`

  Runs **Metro**, the JavaScript bundler that ships with React Native.\
   Keep this process running in a separate terminal before running the application.

- `yarn start:reset-cache`

  Clears the cache related to the development environment before running Metro. This can help resolve certain npm errors, inconsistencies, and free up disk space by removing redundant packages that have accumulated.

### Running the Application

Make sure Metro is running, then run:

- `yarn android`

  Builds and runs the Android version of the app in the default Android emulator.

- `yarn ios`

  Builds and runs the iOS version of the app in the iOS Simulator.

#### Feature Flags considerations

LaunchDarkly currently has a issue with Flipper interfering with streaming connections on Android [link](https://github.com/launchdarkly/js-core/blob/main/packages/sdk/react-native/example/README.md#quickstart)
Using features that require feature flags requires running the release version of the app, e.g. `yarn android:dev-release`
Alternatively, you may manually edit the value of a flag by modifying it in the `useFeatureFlags` hook:

```javascript
  const updateFeatureFlags = () => {
    ...
    features.testingFlag = true;
    setFlags(features);
  };
```

### Updating the Application version

Install Fastlane via Homebrew: `brew install fastlane`.

Update the version in the `package.json` file and run: `yarn bump`. The default behavior will increment the build version by 1 and generate a commit message automatically.

If you only want to update the build version without modifying the `package.json` file, simply run: `yarn bump`.

You can also customize the bump behavior by passing options:

- To skip the commit message, use `skipCommit:true`.
- To increment the build version by a specific number, use `increment:x`.

Example: `yarn bump skipCommit:true increment:5`
This command will skip generating a commit and increment the build version by 5.

#### Alternative Build Configurations

The above scripts run the app using Debug configuration and for Curious's `dev` server environment. You can also run the app using the optimized Release configuration (which disables debugger integration) or for other Curious server environments, including `qa`, `staging`, `uat`, and `production`.

| Command                           | OS      | Build configuration | Server environment |
| --------------------------------- | ------- | ------------------- | ------------------ |
| `yarn android:dev`                | Android | Debug               | `dev`              |
| `yarn android:dev-release`        | Android | Release             | `dev`              |
| `yarn android:qa`                 | Android | Debug               | `qa`               |
| `yarn android:qa-release`         | Android | Release             | `qa`               |
| `yarn android:staging`            | Android | Debug               | `staging`          |
| `yarn android:staging-release`    | Android | Release             | `staging`          |
| `yarn android:uat`                | Android | Debug               | `uat`              |
| `yarn android:uat-release`        | Android | Release             | `uat`              |
| `yarn android:production`         | Android | Debug               | `production`       |
| `yarn android:production-release` | Android | Release             | `production`       |
| `yarn ios:dev`                    | iOS     | Debug               | `dev`              |
| `yarn ios:dev-release`            | iOS     | Release             | `dev`              |
| `yarn ios:qa`                     | iOS     | Debug               | `qa`               |
| `yarn ios:qa-release`             | iOS     | Release             | `qa`               |
| `yarn ios:staging`                | iOS     | Debug               | `staging`          |
| `yarn ios:staging-release`        | iOS     | Release             | `staging`          |
| `yarn ios:uat`                    | iOS     | Debug               | `uat`              |
| `yarn ios:uat-release`            | iOS     | Release             | `uat`              |
| `yarn ios:production`             | iOS     | Debug               | `production`       |
| `yarn ios:production-release`     | iOS     | Release             | `production`       |

### Testing

- `yarn test` - Runs the test suite

### Linting

- `yarn lint` - Check that source code follows eslint rules

## Environment Variables

| Key                                  | Required | Default value                                               | Description                                                              |
| ------------------------------------ | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ENV`                                | no       | `dev`                                                       | App build label (informational only)                                     |
| `API_URL`                            | yes      | `http://localhost:8000`                                     | Curious Backend API base URL                                             |
| `DEEP_LINK_PREFIXES`                 | yes      | `https://web-dev.cmiml.net`                                 | Deep link prefixes for the app, comma-delimited if multiple              |
| `MIXPANEL_TOKEN`                     | no       | null                                                        | Mixpanel analytics token                                                 |
| `STORE_ENCRYPTION_KEY`               | yes      | `my-encryption-key`                                         | Secure storage encryption key                                            |
| `LAUNCHDARKLY_MOBILE_KEY`            | yes      | `my-env-mobile-key`                                         | LaunchDarkly mobile key, refer to Confluence for correct environment key |
| `ONEUP_HEALTH_CLIENT_ID`             | yes\*    | null                                                        | 1UpHealth client ID                                                      |
| `ONEUP_HEALTH_SYSTEM_SEARCH_API_URL` | yes\*    | `https://system-search.1up.health/api`                      | 1UpHealth System Search API URL                                          |

\* Required to use 1UpHealth integration

## Unity

For concerns related to Unity integration, see [unity/README.md](unity/README.md)

## License

Common Public Attribution License Version 1.0 (CPAL-1.0)

Refer to [LICENSE.md](./LICENSE.md)
