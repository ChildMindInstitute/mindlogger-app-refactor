import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import eventsService from '@app/shared/api/services/eventsService';

type FetchFn = typeof eventsService.getEvents;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useEventsQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['events', { appletId }],
    () => eventsService.getEvents({ appletId }),
    {
      ...options,
      enabled: false,
    },
  );
};
