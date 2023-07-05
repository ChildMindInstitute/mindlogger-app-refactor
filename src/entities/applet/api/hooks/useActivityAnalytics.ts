import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { ActivityAnalyticsService } from '@app/shared/api/services/activityAnalyticsService';

type FetchFn = typeof ActivityAnalyticsService.getActivityAnalytics;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useActivityAnalytics = <TData = ReturnAwaited<FetchFn>>(
  activityId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['activity_analytics', { activityId }],
    ActivityAnalyticsService.getActivityAnalytics,
    { ...options, enabled: false },
  );
};
