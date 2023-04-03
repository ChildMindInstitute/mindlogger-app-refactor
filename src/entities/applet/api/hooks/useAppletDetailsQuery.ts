import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import appletsService from '@app/shared/api/services/appletsService';

type FetchFn = typeof appletsService.getAppletDetails;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletDetailsQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['applets', { appletId }],
    () => appletsService.getAppletDetails({ appletId }),
    {
      ...options,
      enabled: false,
    },
  );
};
