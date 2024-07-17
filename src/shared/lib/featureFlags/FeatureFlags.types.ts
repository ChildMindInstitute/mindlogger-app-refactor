import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. enable-multi-informant in LaunchDarky becomes enableMultiInformant
export const FeatureFlagsKeys = {
  enableMultiInformant: 'enable-multi-informant',
  enableMultiInformantTakeNow: 'enable-multi-informant__take-now',
  enableConsentsCapability: 'enable-loris-integration',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
