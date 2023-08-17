import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { AppletAnalyticsService } from '@app/shared/api/services/appletAnalyticsService';

type FetchFn = typeof AppletAnalyticsService.getActivityAnalytics;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletAnalyticsQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  fromDate: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['activity_analytics', { appletId }],
    () => AppletAnalyticsService.getActivityAnalytics({ appletId, fromDate }),
    { ...options },
  );
};
