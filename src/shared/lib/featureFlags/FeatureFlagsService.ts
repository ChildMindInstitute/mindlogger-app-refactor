import {
  AutoEnvAttributes,
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import {
  LD_KIND_PREFIX,
  FeatureFlagKeyDefaults,
  FeatureFlagArrayDefaults,
} from './FeatureFlags.const';
import { IFeatureFlagsService } from './IFeatureFlagsService';
import { LAUNCHDARKLY_MOBILE_KEY } from '../constants';
import { ILogger } from '../types/logger';

export class FeatureFlagsService implements IFeatureFlagsService {
  private logger: ILogger;
  private client: ReactNativeLDClient | undefined;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  init(): ReactNativeLDClient {
    if (!this.client) {
      this.logger.log(
        '[FeatureFlagsService]: Create and init LaunchDarkly client',
      );

      const LaunchDarklyClient = this.getLaunchDarklyClientClass();
      this.client = new LaunchDarklyClient(
        this.getLaunchDarklyMobileKey(),
        AutoEnvAttributes.Disabled,
        {},
      );
    }
    return this.client;
  }

  async login(userId: string): Promise<void> {
    if (!this.client) {
      return;
    }

    const context = {
      kind: LD_KIND_PREFIX,
      key: `${LD_KIND_PREFIX}-${userId}`,
    };

    return this.client.identify(context);
  }

  async logout(): Promise<void> {
    if (!this.client) {
      return;
    }

    return this.client.identify({
      // The key attribute is required and should be empty
      // The SDK will automatically generate a unique, stable key
      key: '',
      kind: 'user',
      anonymous: true,
    });
  }

  evaluateFlag(flag: string): boolean {
    // Get default value for this flag
    const defaultValue = FeatureFlagKeyDefaults[flag] ?? false;

    if (!this.client) {
      return defaultValue;
    }

    // Use LaunchDarkly value with our default as fallback
    return this.client.boolVariation(flag, defaultValue);
  }

  evaluateStringArrayFlag(flag: string): string[] {
    const defaultValue = FeatureFlagArrayDefaults[flag] ?? [];

    if (!this.client) {
      return defaultValue;
    }

    const value = this.client.jsonVariation(flag, defaultValue);

    // LaunchDarkly can return any JSON shape, so only trust an array of strings
    if (!Array.isArray(value)) {
      return defaultValue;
    }

    return value.filter((item): item is string => typeof item === 'string');
  }

  setChangeHandler(fn: (ctx: LDContext, changedKeys: string[]) => void): void {
    if (!this.client) {
      return;
    }
    this.client.on('change', fn);
  }

  removeChangeHandler(fn: Function): void {
    if (!this.client) {
      return;
    }
    this.client.off('change', fn);
  }

  private getLaunchDarklyClientClass() {
    return ReactNativeLDClient;
  }

  private getLaunchDarklyMobileKey() {
    return LAUNCHDARKLY_MOBILE_KEY;
  }
}
