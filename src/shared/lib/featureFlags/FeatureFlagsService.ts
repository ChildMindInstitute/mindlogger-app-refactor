import {
  AutoEnvAttributes,
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { LD_KIND_PREFIX } from './FeatureFlags.const';
import { LAUNCHDARKLY_MOBILE_KEY } from '../constants';
import { Logger } from '../services';

let ldClient: ReactNativeLDClient;

const FeatureFlagsService = {
  async init(): Promise<ReactNativeLDClient> {
    Logger.log('[FeatureFlagsService]: Create and init LaunchDarkly ldClient');
    ldClient = new ReactNativeLDClient(
      LAUNCHDARKLY_MOBILE_KEY,
      AutoEnvAttributes.Disabled,
      {},
    );
    return ldClient;
  },
  async login(userId: string): Promise<void> {
    if (!ldClient) {
      return;
    }
    const context = {
      kind: LD_KIND_PREFIX,
      key: `${LD_KIND_PREFIX}-${userId}`,
    };

    return ldClient.identify(context);
  },
  async logout(): Promise<void> {
    if (!ldClient) {
      return;
    }
    return ldClient.identify({
      // The key attribute is required and should be empty
      // The SDK will automatically generate a unique, stable key
      key: '',
      kind: 'user',
      anonymous: true,
    });
  },
  evaluateFlag(flag: string): boolean {
    if (!ldClient) {
      return false;
    }
    return ldClient.boolVariation(flag, false);
  },
  setChangeHandler(
    changeHandler: (ctx: LDContext, changedKeys: string[]) => void,
  ): void {
    if (!ldClient) {
      return;
    }
    ldClient.on('change', changeHandler);
  },
  removeChangeHandler(changeHandler: Function): void {
    if (!ldClient) {
      return;
    }
    ldClient.off('change', changeHandler);
  },
};

export default FeatureFlagsService;
