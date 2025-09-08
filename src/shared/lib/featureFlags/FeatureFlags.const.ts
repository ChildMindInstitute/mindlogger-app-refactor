export const PROHIBITED_PII_KEYS = ['firstName', 'lastName', 'email'];
export const LD_KIND_PREFIX = 'mobile-app-users';

import { FeatureFlagsKeys } from './FeatureFlags.types';

// Default values for feature flags when LaunchDarkly doesn't provide a value
// These defaults are aligned with the admin app defaults for consistency
export const FeatureFlagKeyDefaults: Record<
  (typeof FeatureFlagsKeys)[keyof typeof FeatureFlagsKeys],
  boolean
> = {
  'enable-loris-integration': false,
  'enable-better-drawing-image-sizing': true,
};
