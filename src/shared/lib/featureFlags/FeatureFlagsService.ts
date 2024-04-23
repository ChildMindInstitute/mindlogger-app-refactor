import {
  AutoEnvAttributes,
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { LD_KIND_PREFIX } from './FeatureFlags.const';
import { LAUNCHDARKLY_CLIENT_ID } from '../constants';
import { Logger } from '../services';

let launchDarkly: ReactNativeLDClient;

const FeatureFlagsService = {
  async init(): Promise<ReactNativeLDClient> {
    Logger.log('[FeatureFlagsService]: Create and init LaunchDarkly client');
    launchDarkly = new ReactNativeLDClient(
      LAUNCHDARKLY_CLIENT_ID,
      AutoEnvAttributes.Disabled,
      {},
    );
    return launchDarkly;
  },
  async login(userId: string) {
    const context = {
      kind: LD_KIND_PREFIX,
      key: `${LD_KIND_PREFIX}-${userId}`,
    };
    Logger.log(`[FeatureFlagsService]: login: ${userId}`);

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
