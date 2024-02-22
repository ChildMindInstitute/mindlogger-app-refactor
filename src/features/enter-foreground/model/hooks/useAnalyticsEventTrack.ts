import { AnalyticsService, MixEvents, useOnForeground } from '@app/shared/lib';

function useAnalyticsEventTrack() {
  useOnForeground(() => {
    AnalyticsService.track(MixEvents.AppReOpen);
  });
}

export default useAnalyticsEventTrack;
