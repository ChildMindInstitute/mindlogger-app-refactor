export const PROHIBITED_PII_KEYS = ['firstName', 'lastName', 'email'];
export const LD_KIND_PREFIX = 'mobile-app-users';

// Map flag keys (the actual LaunchDarkly keys) to their default values
// These defaults are used when LaunchDarkly doesn't provide a value
export const FeatureFlagKeyDefaults: Record<string, boolean> = {
  'enable-loris-integration': false,
  'enable-activity-assign': false,
  'enable-better-drawing-image-sizing': true, // Default to true as requested
};
