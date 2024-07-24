import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

export const FeatureFlagsKeys = {
  enableConsentsCapability: 'enableLorisIntegration',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
