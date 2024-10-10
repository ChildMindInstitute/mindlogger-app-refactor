import { useBaseQuery } from '@app/shared/api/hooks/useBaseQuery';
import { getDefaultAppletsService } from '@app/shared/api/services/appletsServiceInstance';
import { QueryOptions, ReturnAwaited } from '@app/shared/api/types';

type FetchFn = ReturnType<typeof getDefaultAppletsService>['getApplets'];
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletsQuery = <TData = ReturnAwaited<FetchFn>>(
  options?: Options<TData>,
) => {
  return useBaseQuery(['applets'], getDefaultAppletsService().getApplets, {
    ...options,
    enabled: false,
  });
};
