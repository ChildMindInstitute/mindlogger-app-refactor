import {
  AutoEnvAttributes,
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { LD_KIND_PREFIX } from './FeatureFlags.const';
import { LAUNCHDARKLY_MOBILE_KEY } from '../constants';
import { Logger } from '../services';

let launchDarkly: ReactNativeLDClient;

const FeatureFlagsService = {
  async init(): Promise<ReactNativeLDClient> {
    Logger.log('[FeatureFlagsService]: Create and init LaunchDarkly client');
    launchDarkly = new ReactNativeLDClient(
      LAUNCHDARKLY_MOBILE_KEY,
      AutoEnvAttributes.Disabled,
      {},
    );
    return launchDarkly;
  },
  async login(userId: string): Promise<void> {
    const context = {
      kind: LD_KIND_PREFIX,
      key: `${LD_KIND_PREFIX}-${userId}`,
    };

    return launchDarkly.identify(context);
  },
  logout(): Promise<void> {
    return launchDarkly.identify({
      // The key attribute is required and should be empty
      // The SDK will automatically generate a unique, stable key
      key: '',
      kind: 'user',
      anonymous: true,
    });
  },
  evaluateFlag(flag: string): boolean {
    return launchDarkly.boolVariation(flag, false);
  },
  setChangeHandler(
    changeHandler: (ctx: LDContext, changedKeys: string[]) => void,
  ): void {
    launchDarkly.on('change', changeHandler);
  },
  removeChangeHandler(changeHandler: Function): void {
    launchDarkly.off('change', changeHandler);
  },
};

export default FeatureFlagsService;
