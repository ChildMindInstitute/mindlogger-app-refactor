import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { AppletAnalyticsService } from '@app/shared/api/services/appletAnalyticsService';

type FetchFn = typeof AppletAnalyticsService.getActivityAnalytics;
type Options<TData> = QueryOptions<FetchFn, TData>;
type Payload = {
  appletId: string;
  fromDate: string;
  isLastVersion: boolean;
};

export const useAppletAnalyticsQuery = <TData = ReturnAwaited<FetchFn>>(
  payload: Payload,
  options?: Options<TData>,
) => {
  const { appletId, isLastVersion, fromDate } = payload;

  return useBaseQuery(
    ['activity_analytics', { appletId, isLastVersion }],
    () =>
      AppletAnalyticsService.getActivityAnalytics({
        appletId,
        fromDate,
        isLastVersion,
      }),
    { ...options, staleTime: 0 },
  );
};
