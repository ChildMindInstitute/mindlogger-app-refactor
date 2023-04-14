import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { EventsService } from '@app/shared/api';

type FetchFn = typeof EventsService.getEvents;
type Options<TData> = QueryOptions<FetchFn, TData>;

const useEventsQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['events', { appletId }],
    () => EventsService.getEvents({ appletId }),
    {
      ...options,
      enabled: false,
    },
  );
};

export default useEventsQuery;
