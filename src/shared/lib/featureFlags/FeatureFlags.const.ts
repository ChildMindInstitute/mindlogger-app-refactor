export const PROHIBITED_PII_KEYS = ['firstName', 'lastName', 'email'];
export const LD_KIND_PREFIX = 'mobile-app-users';

import { FeatureFlagArrayKeys, FeatureFlagsKeys } from './FeatureFlags.types';

// Default values for feature flags when LaunchDarkly doesn't provide a value
// These defaults are aligned with the admin app defaults for consistency
export const FeatureFlagKeyDefaults: Record<
  (typeof FeatureFlagsKeys)[keyof typeof FeatureFlagsKeys],
  boolean
> = {
  'enable-loris-integration': false,
  'enable-better-drawing-image-sizing': true,
};

// Defaults for array-valued flags. An empty list means the flag affects no
// applets, so an unreachable LaunchDarkly leaves current behaviour unchanged.
export const FeatureFlagArrayDefaults: Record<
  (typeof FeatureFlagArrayKeys)[keyof typeof FeatureFlagArrayKeys],
  string[]
> = {
  'hide-data-tab-applets': [],
};
