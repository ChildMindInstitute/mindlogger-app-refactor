import { useBaseQuery } from '@app/shared/api/hooks/useBaseQuery';
import { getDefaultAppletAnalyticsService } from '@app/shared/api/services/appletAnalyticsServiceInstance';
import { QueryOptions, ReturnAwaited } from '@app/shared/api/types';

type FetchFn = ReturnType<
  typeof getDefaultAppletAnalyticsService
>['getActivityAnalytics'];
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
      getDefaultAppletAnalyticsService().getActivityAnalytics({
        appletId,
        fromDate,
        isLastVersion,
        respondentIds,
      }),
    { ...options, staleTime: 0 },
  );
};
