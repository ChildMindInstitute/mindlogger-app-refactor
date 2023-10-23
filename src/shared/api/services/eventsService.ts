import { NotificationTriggerType } from '@app/abstract/lib';
import { HourMinute, callApiWithRetry } from '@app/shared/lib';

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
  fromTime: HourMinute | null;
  toTime: HourMinute | null;
  atTime: HourMinute | null;
};

export type ScheduleEventDto = {
  id: string;
  entityId: string;
  availabilityType: string;
  availability: EventAvailabilityDto;
  notificationSettings: NotificationsSectionDto | null;
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

export type CompletedEntityDto = {
  id: string;
  answerId: string;
  submitId: string;
  scheduledEventId: string;
  localEndDate: string; // YYYY-MM-DD
  localEndTime: string; // hh:mm:ss
};

type AppletCompletedEntitiesRequest = {
  appletId: string;
  fromDate: string; // YYYY-MM-DD
  version: string;
};

export type AppletCompletedEntitiesResponse = SuccessfulResponse<{
  id: string;
  version: string;
  activities: CompletedEntityDto[];
  activityFlows: CompletedEntityDto[];
}>;

function eventsService() {
  return {
    getEvents(request: AppletEventsRequest) {
      const apiCall = () =>
        httpService.get<AppletEventsResponse>(
          `/users/me/events/${request.appletId}`,
        );
      return callApiWithRetry(apiCall);
    },
    getCompletedEntities(request: AppletCompletedEntitiesRequest) {
      return httpService.get<AppletCompletedEntitiesResponse>(
        `answers/applet/${request.appletId}/completions`,
        {
          params: {
            fromDate: request.fromDate,
            version: request.version,
          },
        },
      );
    },
  };
}

export const EventsService = eventsService();
