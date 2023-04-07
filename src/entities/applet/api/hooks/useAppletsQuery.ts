import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import appletsService from '@app/shared/api/services/appletsService';

type FetchFn = typeof appletsService.getApplets;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletsQuery = <TData = ReturnAwaited<FetchFn>>(
  options?: Options<TData>,
) => {
  return useBaseQuery(['applets'], appletsService.getApplets, {
    ...options,
    enabled: false,
  });
};
