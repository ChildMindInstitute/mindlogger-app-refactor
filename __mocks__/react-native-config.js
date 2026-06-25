// Jest manual mock for react-native-config.
// In RN 0.85, the bridge was removed and react-native-config now uses
// TurboModuleRegistry which returns null in Jest. This mock provides
// empty config values so tests can run without the native module.
// See: https://github.com/luggit/react-native-config#jest
export default {
  ENV: '',
  API_URL: '',
  MIXPANEL_TOKEN: '',
  STORE_ENCRYPTION_KEY: '',
  LAUNCHDARKLY_MOBILE_KEY: '',
  DATADOG_CLIENT_TOKEN: '',
  DATADOG_APPLICATION_ID: '',
  DEEP_LINK_PREFIXES: '',
};
