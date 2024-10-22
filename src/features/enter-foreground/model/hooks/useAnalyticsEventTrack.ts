import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { useOnForeground } from '@app/shared/lib/hooks/useOnForeground';

export function useAnalyticsEventTrack() {
  useOnForeground(() => {
    getDefaultAnalyticsService().track(MixEvents.AppReOpen);
  });
}
