export const PROHIBITED_PII_KEYS = ['firstName', 'lastName', 'email'];
export const LD_KIND_PREFIX = 'mobile-app-users';

import { FeatureFlagsKeys } from './FeatureFlags.types';

// Default values for feature flags when LaunchDarkly doesn't provide a value
// These defaults are aligned with the admin app defaults for consistency
// Note: enable-flow-resume is a string[] (applet IDs or ['*'] for all)
export const FeatureFlagKeyDefaults: Record<
  (typeof FeatureFlagsKeys)[keyof typeof FeatureFlagsKeys],
  boolean | string[]
> = {
  'enable-loris-integration': false,
  'enable-better-drawing-image-sizing': true,
  'enable-flow-resume': [], // Empty array = disabled for all applets
};
