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
  targetSubjectId: string | null;
  localEndDate: string | null; // YYYY-MM-DD - null for in-progress flows
  localEndTime: string | null; // hh:mm:ss - null for in-progress flows
  startTime?: number; // millisecond timestamp when activity/flow started
  endTime?: number; // millisecond timestamp when activity/flow ended
  isFlowCompleted?: boolean | null; // true=completed, false=in-progress, null=standalone activity
  activityFlowOrder?: number | null; // 0-indexed position of NEXT activity to complete (for in-progress flows)
};

export type CompletedEntitiesRequest = {
  fromDate: string; // YYYY-MM-DD
  includeInProgress?: boolean;
};

export type AppletCompletedEntitiesRequest = {
  appletId: string;
  fromDate: string; // YYYY-MM-DD
  includeInProgress?: boolean;
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

  getAppletCompletedEntities: (
    request: AppletCompletedEntitiesRequest,
  ) => Promise<AxiosResponse<AppletCompletedEntitiesResponse>>;
};
