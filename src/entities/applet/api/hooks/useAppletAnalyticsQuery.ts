import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { AppletAnalyticsService } from '@app/shared/api/services/appletAnalyticsService';

type FetchFn = typeof AppletAnalyticsService.getActivityAnalytics;
type Options<TData> = QueryOptions<FetchFn, TData>;
type Payload = {
  appletId: string;
  fromDate: string;
  isLastVersion: boolean;
  respondentIds: string;
};

export const useAppletAnalyticsQuery = <TData = ReturnAwaited<FetchFn>>(
  payload: Payload,
  options?: Options<TData>,
) => {
  const { appletId, isLastVersion, fromDate, respondentIds } = payload;

  return useBaseQuery(
    ['activity_analytics', { appletId, isLastVersion }],
    () =>
      AppletAnalyticsService.getActivityAnalytics({
        appletId,
        fromDate,
        isLastVersion,
        respondentIds,
      }),
    { ...options, staleTime: 0 },
  );
};
