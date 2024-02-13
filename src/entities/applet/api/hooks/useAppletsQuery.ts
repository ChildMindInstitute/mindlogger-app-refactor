import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { AppletsService } from '@app/shared/api';

type FetchFn = typeof AppletsService.getApplets;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletsQuery = <TData = ReturnAwaited<FetchFn>>(
  options?: Options<TData>,
) => {
  return useBaseQuery(['applets'], AppletsService.getApplets, {
    ...options,
    enabled: false,
  });
};
