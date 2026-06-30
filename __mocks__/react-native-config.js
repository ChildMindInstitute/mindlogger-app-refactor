// Jest manual mock for react-native-config.
// The native module is not available in Jest, so we provide
// empty config values for tests.
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
