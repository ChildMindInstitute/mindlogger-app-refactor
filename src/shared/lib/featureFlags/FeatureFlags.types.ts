import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

export const FeatureFlagsKeys = {
  enableConsentsCapability: 'enable-loris-integration',
  enableBetterDrawingImageSizing: 'enable-better-drawing-image-sizing',
};

// Flags whose LaunchDarkly value is a JSON array rather than a boolean.
// Kept separate from FeatureFlagsKeys because useFeatureFlags iterates that map
// and reads every key as a boolean.
export const FeatureFlagArrayKeys = {
  hideDataTabApplets: 'hide-data-tab-applets',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
