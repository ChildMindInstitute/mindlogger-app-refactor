import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { AppletsService } from '@app/shared/api';

type FetchFn = typeof AppletsService.getAppletDetails;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletDetailsQuery = <TData = ReturnAwaited<FetchFn>>(appletId: string, options?: Options<TData>) => {
  return useBaseQuery(['applets', { appletId }], () => AppletsService.getAppletDetails({ appletId }), {
    ...options,
    enabled: false,
  });
};
