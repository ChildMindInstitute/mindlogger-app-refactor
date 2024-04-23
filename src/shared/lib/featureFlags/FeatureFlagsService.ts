import {
  AutoEnvAttributes,
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { LAUNCHDARKLY_CLIENT_ID } from '../constants';
import { Logger } from '../services';

let launchDarkly: ReactNativeLDClient;

const FeatureFlagsService = {
  async init(): Promise<ReactNativeLDClient> {
    Logger.log('[FeatureFlagsService]: Create and init LaunchDarkly client');
    launchDarkly = new ReactNativeLDClient(
      LAUNCHDARKLY_CLIENT_ID,
      AutoEnvAttributes.Enabled,
      {},
    );
    return launchDarkly;
  },
  async login(userId: string) {
    const context = {
      kind: 'mobile-app-users',
      key: `mobile-app-users-${userId}`,
    };
    return launchDarkly.identify(context);
  },
  logout() {
    launchDarkly.identify({
      // The key attribute is required and should be empty
      // The SDK will automatically generate a unique, stable key
      key: '',
      kind: 'user',
      anonymous: true,
    });
  },
  flags() {
    return launchDarkly.allFlags();
  },
  evaluateFlag(flag: string) {
    return launchDarkly.boolVariation(flag, false);
  },
  setChangeHandler(
    changeHandler: (ctx: LDContext, changedKeys: string[]) => void,
  ) {
    launchDarkly.on('change', changeHandler);
  },
};

export default FeatureFlagsService;
