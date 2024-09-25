import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib/types/event.ts';
import { ScheduleEventDto } from '@app/shared/api/services/IEventsService.ts';

import { ScheduleEvent } from '../../lib/types/event.ts';
import { mapEventsFromDto } from '../mappers.ts';

const scheduleEventDto: ScheduleEventDto = {
  id: '1',
  availabilityType: AvailabilityType.AlwaysAvailable,
  selectedDate: null,
  timers: {
    timer: null,
    idleTimer: null,
  },
  entityId: '2',
  availability: {
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    timeFrom: null,
    timeTo: null,
    allowAccessBeforeFromTime: false,
    startDate: null,
    endDate: null,
  },
  notificationSettings: {
    reminder: {
      activityIncomplete: 1,
      reminderTime: {
        hours: 1,
        minutes: 1,
      },
    },
    notifications: [
      {
        triggerType: NotificationTriggerType.FIXED,
        fromTime: {
          hours: 1,
          minutes: 1,
        },
        toTime: null,
        atTime: null,
      },
    ],
  },
};

export const scheduleEvent: ScheduleEvent = {
  availability: {
    allowAccessBeforeFromTime: false,
    availabilityType: AvailabilityType.AlwaysAvailable,
    endDate: null,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    startDate: null,
    timeFrom: null,
    timeTo: null,
  },
  entityId: '2',
  id: '1',
  notificationSettings: {
    notifications: [],
    reminder: null,
  },
  scheduledAt: null,
  selectedDate: null,
  timers: {
    idleTimer: null,
    timer: null,
  },
};

describe('Pass survey mapStreamEventToDto', () => {
  it('Should return mapped result for AbTrails item Live event', () => {
    const result = mapEventsFromDto([scheduleEventDto]);

    expect(result).toEqual([scheduleEvent]);
  });
});
