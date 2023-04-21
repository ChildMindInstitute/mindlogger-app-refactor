import useEventsQuery from './useEventsQuery';
import { ScheduleEvent } from '../../lib';
import { mapEventFromDto } from '../../model/mappers';

const useEventQuery = (appletId: string, eventId: string): ScheduleEvent => {
  const { data: event } = useEventsQuery(appletId, {
    select: response => {
      const dto = response.data.result.events.find(x => x.id === eventId);
      return mapEventFromDto(dto!);
    },
  });
  return event!;
};

export default useEventQuery;
