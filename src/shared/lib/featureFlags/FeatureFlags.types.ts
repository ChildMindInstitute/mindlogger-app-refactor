import { LDFlagValue } from '@launchdarkly/react-native-client-sdk';

export const FeatureFlagsKeys = {
  enableConsentsCapability: 'enable-loris-integration',
  enableBetterDrawingImageSizing: 'enable-better-drawing-image-sizing',
  enableCrossDeviceFlowSync: 'enable-cross-device-flow-sync',
};

export type FeatureFlags = Partial<
  Record<keyof typeof FeatureFlagsKeys, LDFlagValue>
>;
