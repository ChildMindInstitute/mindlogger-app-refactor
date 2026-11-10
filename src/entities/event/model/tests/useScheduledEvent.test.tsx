import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { getEventsKey } from '@app/shared/lib/utils/reactQueryHelpers';

import { useScheduledEvent } from '../hooks/useEvent';

const AppletId = 'applet-id';

const EventId = 'event-id';

const eventDto = {
  id: EventId,
  entityId: 'activity-id',
  selectedDate: null,
  timers: { idleTimer: null, timer: { hours: 0, minutes: 30 } },
  availabilityType: 'AlwaysAvailable',
  availability: {
    allowAccessBeforeFromTime: false,
    periodicityType: 'ALWAYS',
    startDate: null,
    endDate: null,
    oneTimeCompletion: false,
    timeFrom: null,
    timeTo: null,
  },
  notificationSettings: null,
  version: '1',
};

const setEvents = (queryClient: QueryClient) =>
  queryClient.setQueryData(getEventsKey(AppletId), {
    data: { result: { events: [eventDto] } },
  });

const renderScheduledEvent = (queryClient: QueryClient) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(
    () => useScheduledEvent({ appletId: AppletId, eventId: EventId }),
    { wrapper },
  );
};

let queryClient: QueryClient;

describe('useScheduledEvent', () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('Should return the scheduled event from the events cache', () => {
    setEvents(queryClient);

    const { result } = renderScheduledEvent(queryClient);

    expect(result.current?.id).toBe(EventId);
    expect(result.current?.timers.timer).toEqual({ hours: 0, minutes: 30 });
  });

  it('Should keep returning the last event while a refresh has removed the events cache', () => {
    setEvents(queryClient);

    const { result, rerender } = renderScheduledEvent(queryClient);

    // RefreshService removes all events before refetching them
    queryClient.removeQueries(['events']);

    rerender({});

    expect(result.current?.id).toBe(EventId);
  });

  it('Should return undefined when the events were never loaded', () => {
    const { result } = renderScheduledEvent(queryClient);

    expect(result.current).toBeUndefined();
  });
});
