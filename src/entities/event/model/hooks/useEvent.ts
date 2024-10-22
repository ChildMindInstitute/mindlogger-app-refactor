import { useQueryClient } from '@tanstack/react-query';

import { AppletEventsResponse } from '@app/shared/api/services/IEventsService';
import {
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import { ScheduleEvent } from '../../lib/types/event';
import { mapEventsFromDto } from '../mappers';

type UseScheduledEventArgs = {
  appletId: string;
  eventId: string;
};

export function useScheduledEvent({
  appletId,
  eventId,
}: UseScheduledEventArgs) {
  const queryClient = useQueryClient();

  const eventsResponse = getDataFromQuery<AppletEventsResponse>(
    getEventsKey(appletId),
    queryClient,
  )!;

  const events: ScheduleEvent[] = mapEventsFromDto(
    eventsResponse.result.events,
  );

  return events.find(event => event.id === eventId);
}
