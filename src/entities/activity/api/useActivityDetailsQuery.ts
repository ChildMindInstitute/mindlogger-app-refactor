import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { ActivityService } from '@app/shared/api';

type FetchFn = typeof ActivityService.getById;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useActivityDetailsQuery = <TData = ReturnAwaited<FetchFn>>(
  activityId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['activities', { activityId }],
    () => ActivityService.getById(activityId),
    {
      ...options,
      enabled: false,
    },
  );
};
