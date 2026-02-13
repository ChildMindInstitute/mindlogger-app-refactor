import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

export const FeatureFlagsKeys = {
  enableConsentsCapability: 'enable-loris-integration',
  enableBetterDrawingImageSizing: 'enable-better-drawing-image-sizing',
  // Note: This flag returns a string[] of applet IDs (or ['*'] for all applets)
  enableCrossDeviceFlowSync: 'enable-flow-resume',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
