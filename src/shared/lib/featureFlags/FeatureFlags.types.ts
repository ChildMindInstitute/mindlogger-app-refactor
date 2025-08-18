import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

export const FeatureFlagsKeys = {
  enableConsentsCapability: 'enable-loris-integration',
  enableActivityAssign: 'enable-activity-assign',
  enableBetterDrawingImageSizing: 'enable-better-drawing-image-sizing',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
