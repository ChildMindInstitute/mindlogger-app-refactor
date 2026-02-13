import { getDefaultFeatureFlagsService } from './featureFlagsServiceInstance';
import { isFlowResumeEnabled } from './isFlowResumeEnabled';

describe('isFlowResumeEnabled', () => {
  it('should return true when flag contains "*" for all applets', () => {
    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue(['*']);

    expect(isFlowResumeEnabled('applet-1')).toBe(true);
    expect(isFlowResumeEnabled('applet-2')).toBe(true);
    expect(isFlowResumeEnabled('any-applet-id')).toBe(true);
  });

  it('should return true when flag contains the specific applet ID', () => {
    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue(['applet-1', 'applet-2']);

    expect(isFlowResumeEnabled('applet-1')).toBe(true);
    expect(isFlowResumeEnabled('applet-2')).toBe(true);
    expect(isFlowResumeEnabled('applet-3')).toBe(false);
  });

  it('should return false when flag is empty array', () => {
    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue([]);

    expect(isFlowResumeEnabled('applet-1')).toBe(false);
    expect(isFlowResumeEnabled('applet-2')).toBe(false);
  });

  it('should return false when applet ID not in flag array', () => {
    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue(['applet-5', 'applet-6']);

    expect(isFlowResumeEnabled('applet-1')).toBe(false);
    expect(isFlowResumeEnabled('applet-2')).toBe(false);
  });
});
