import { AxiosResponse } from 'axios';

import { NotificationTriggerType } from '@app/abstract/lib/types/event';
import { HourMinute } from '@app/shared/lib/types/dateTime';

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
  version?: string;
};

export type AppletEventsResponse = SuccessfulResponse<{
  events: ScheduleEventDto[];
}>;

export type AllEventsResponse = SuccessfulResponse<
  Array<{ appletId: string; events: ScheduleEventDto[] }>
>;

export type CompletedEntityDto = {
  id: string;
  answerId: string;
  submitId: string;
  scheduledEventId: string;
  targetSubjectId: string;
  localEndDate: string; // YYYY-MM-DD
  localEndTime: string; // hh:mm:ss
};

export type CompletedEntitiesRequest = {
  fromDate: string; // YYYY-MM-DD
};

export type AppletCompletedEntitiesResponse = SuccessfulResponse<{
  id: string;
  version: string;
  activities: CompletedEntityDto[];
  activityFlows: CompletedEntityDto[];
}>;

export type EntitiesCompletionsDto = {
  id: string;
  version: string;
  activities: CompletedEntityDto[];
  activityFlows: CompletedEntityDto[];
};

export type CompletedEntitiesResponse = SuccessfulResponse<
  Array<EntitiesCompletionsDto>
>;

export type IEventsService = {
  getAllEvents: () => Promise<AxiosResponse<AllEventsResponse>>;

  getAllCompletedEntities: (
    request: CompletedEntitiesRequest,
  ) => Promise<AxiosResponse<CompletedEntitiesResponse>>;
};
