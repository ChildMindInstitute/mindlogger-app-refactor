import { useRef } from 'react';

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

  // Last event found for this applet/event, used while the events cache is empty
  const lastEventRef = useRef<{
    key: string;
    event: ScheduleEvent | undefined;
  } | null>(null);

  const key = `${appletId}/${eventId}`;

  const eventsResponse = getDataFromQuery<AppletEventsResponse>(
    getEventsKey(appletId),
    queryClient,
  );

  // A refresh removes all events from the cache before refetching them, so
  // they can be briefly missing while an activity screen is still mounted
  // (e.g. after tapping a notification while answers upload) (M2-11197)
  if (!eventsResponse) {
    return lastEventRef.current?.key === key
      ? lastEventRef.current.event
      : undefined;
  }

  const events: ScheduleEvent[] = mapEventsFromDto(
    eventsResponse.result.events,
  );

  const event = events.find(e => e.id === eventId);

  lastEventRef.current = { key, event };

  return event;
}
