import { useCallback, useRef, useEffect } from 'react';

import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';

type MfaType = 'totp' | 'recovery';

interface UseMfaAnalyticsOptions {
  type: MfaType;
}

interface TrackVerificationFailedParams {
  errorCode: string;
  attemptsRemaining?: number | null;
  attemptType?: 'session' | 'global' | null;
}

export const useMfaAnalytics = ({ type }: UseMfaAnalyticsOptions) => {
  const hasTrackedMount = useRef(false);
  const analytics = getDefaultAnalyticsService();

  // Track challenge presented on mount (once)
  useEffect(() => {
    if (!hasTrackedMount.current) {
      hasTrackedMount.current = true;
      analytics.track(MixEvents.MFAChallengePresented, {
        [MixProperties.MFAType]: type,
      });
    }
  }, [type, analytics]);

  const trackCodeSubmitted = useCallback(
    (isAutoSubmit: boolean) => {
      if (type === 'totp') {
        analytics.track(MixEvents.MFATOTPCodeSubmitted, {
          [MixProperties.MFAIsAutoSubmit]: isAutoSubmit,
        });
      } else {
        analytics.track(MixEvents.MFARecoveryCodeSubmitted);
      }
    },
    [type, analytics],
  );

  const trackVerificationSuccess = useCallback(() => {
    const event =
      type === 'totp'
        ? MixEvents.MFATOTPVerificationSuccess
        : MixEvents.MFARecoveryVerificationSuccess;
    analytics.track(event);
  }, [type, analytics]);

  const trackVerificationFailed = useCallback(
    (params: TrackVerificationFailedParams) => {
      const event =
        type === 'totp'
          ? MixEvents.MFATOTPVerificationFailed
          : MixEvents.MFARecoveryVerificationFailed;

      const properties: Record<string, unknown> = {
        [MixProperties.MFAErrorCode]: params.errorCode,
      };

      if (
        params.attemptsRemaining !== undefined &&
        params.attemptsRemaining !== null
      ) {
        properties[MixProperties.MFAAttemptsRemaining] =
          params.attemptsRemaining;
      }

      if (params.attemptType) {
        properties[MixProperties.MFAAttemptType] = params.attemptType;
      }

      analytics.track(event, properties);
    },
    [type, analytics],
  );

  const trackSessionExpired = useCallback(
    (errorCode: string) => {
      analytics.track(MixEvents.MFASessionExpired, {
        [MixProperties.MFAErrorCode]: errorCode,
      });
    },
    [analytics],
  );

  const trackSwitchToRecovery = useCallback(() => {
    analytics.track(MixEvents.MFASwitchToRecovery);
  }, [analytics]);

  const trackSwitchToTOTP = useCallback(() => {
    analytics.track(MixEvents.MFASwitchToTOTP);
  }, [analytics]);

  const trackBackToLogin = useCallback(() => {
    analytics.track(MixEvents.MFABackToLogin);
  }, [analytics]);

  return {
    trackCodeSubmitted,
    trackVerificationSuccess,
    trackVerificationFailed,
    trackSessionExpired,
    trackSwitchToRecovery,
    trackSwitchToTOTP,
    trackBackToLogin,
  };
};
