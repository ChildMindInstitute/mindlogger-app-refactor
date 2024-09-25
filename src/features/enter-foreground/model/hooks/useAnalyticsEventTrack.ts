import {
  AnalyticsService,
  MixEvents,
} from '@app/shared/lib/analytics/AnalyticsService';
import { useOnForeground } from '@app/shared/lib/hooks/useOnForeground';

export function useAnalyticsEventTrack() {
  useOnForeground(() => {
    AnalyticsService.track(MixEvents.AppReOpen);
  });
}
