import { QueryOptions, ReturnAwaited, useBaseQueries } from '@app/shared/api';
import { EventsService } from '@app/shared/api';
import { getAppletCompletedEntitiesKey } from '@app/shared/lib';

type FetchFn = typeof EventsService.getCompletedEntities;
type Options<TData> = QueryOptions<FetchFn, TData>;

type OnSuccess<TData, TVariables> = {
  onSuccess: (data: TData, variables: TVariables) => void;
};

export const useCompletedEntitiesQuery = <TData = ReturnAwaited<FetchFn>>(
  fromDate: string,
  keys: Array<{ appletId: string; version: string }> | null,
  options?: Options<TData> & OnSuccess<TData, { appletId: string }>,
) => {
  return useBaseQueries(
    keys?.map(key => {
      return {
        queryKey: getAppletCompletedEntitiesKey(key.appletId),
        queryFn: () => EventsService.getCompletedEntities({ fromDate, ...key }),
        ...options,
        onSuccess: (data: TData) => {
          // @ts-ignore
          options?.onSuccess(data, {
            appletId: key.appletId,
          });
        },
        staleTime: 0,
        cacheTime: 0,
      };
    }) ?? [],
  );
};
