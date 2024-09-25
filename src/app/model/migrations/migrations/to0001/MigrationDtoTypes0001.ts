import { SuccessfulResponse } from '@app/shared/api/types';
import { HourMinute } from '@app/shared/lib/types/dateTime';

import { ImageUrl } from '../to0002/MigrationDtoTypes0002';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: string;
  image: ImageUrl | null;
  order: number;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  order: number;
  activityIds: Array<string>;
};

export type AppletDetailsDto = {
  id: string;
  displayName: string;
  activities: ActivityRecordDto[];
  activityFlows: ActivityFlowRecordDto[];
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
};

export type EventAvailabilityDto = {
  oneTimeCompletion: boolean;
  periodicityType: string;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
};

export type ScheduleEventDto = {
  id: string;
  entityId: string;
  availabilityType: string;
  availability: EventAvailabilityDto;
  selectedDate?: string | null;
};

export type AppletEventsResponse = SuccessfulResponse<{
  events: ScheduleEventDto[];
}>;
