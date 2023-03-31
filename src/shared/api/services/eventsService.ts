import { NotificationTriggerType } from '@app/abstract/lib';
import { HourMinute } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export type EventAvailabilityDto = {
  oneTimeCompletion: boolean;
  periodicityType: string;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
};

export type ReminderSettingDto = {
  activityIncomplete: number;
  reminderTime: HourMinute;
};

export type NotificationsSectionDto = {
  notifications: NotificationSettingDto[];
  reminder: ReminderSettingDto | null;
};

export type NotificationSettingDto = {
  triggerType: NotificationTriggerType;
  from: HourMinute | null;
  to: HourMinute | null;
  at: HourMinute | null;
};

export type ScheduleEventDto = {
  id: string;
  entityId: string;
  availabilityType: string;
  availability: EventAvailabilityDto;
  notificationSettings: NotificationsSectionDto;
  selectedDate?: string | null;
  timers: {
    timer: HourMinute | null;
    idleTimer: HourMinute | null;
  };
};

type AppletEventsRequest = {
  appletId: string;
};

export type AppletEventsResponse = SuccessfulResponse<{
  events: ScheduleEventDto[];
}>;

function eventsService() {
  return {
    getEvents(request: AppletEventsRequest) {
      return httpService.get<AppletEventsResponse>(
        `/users/me/events/${request.appletId}`,
      );
    },
  };
}

export default eventsService();
