import { QueryClient } from '@tanstack/react-query';

import {
  ActivityPipelineType,
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';
import { SuccessfulResponse } from '@app/shared/api';
import {
  buildDateFromDto,
  getAppletDetailsKey,
  getDataFromQuery,
  getEventsKey,
  HourMinute,
  ImageUrl,
} from '@app/shared/lib';

import { RootState0000, StoreProgressPayload0000 } from './MigrationTypes0001';

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

export type NotCompletedEntity = {
  type: ActivityPipelineType;
  appletId: string;
  entityId: string;
  eventId: string;
  payload: StoreProgressPayload0000;
};

export const selectNotCompletedEntities = (
  state: RootState0000,
): NotCompletedEntity[] => {
  const inProgressApplets = state.applets.inProgress;
  const result: NotCompletedEntity[] = [];

  const appletIds = Object.keys(inProgressApplets);

  for (let appletId of appletIds) {
    const progressEntities = inProgressApplets[appletId];

    const entityIds = Object.keys(progressEntities);

    for (let entityId of entityIds) {
      const progressEvents = progressEntities[entityId];

      const eventIds = Object.keys(progressEvents);

      for (let eventId of eventIds) {
        const payload = progressEvents[eventId];

        if (payload.endAt) {
          continue;
        }

        result.push({
          appletId,
          entityId,
          eventId,
          type: payload.type,
          payload,
        });
      }
    }
  }

  return result;
};

export class QueryDataUtils {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  getAppletDto(appletId: string): AppletDetailsDto | null {
    const result = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      this.queryClient,
    );

    return result?.result ?? null;
  }

  getEventsDto(appletId: string): ScheduleEventDto[] | null {
    const eventsKey = getEventsKey(appletId);

    const response = getDataFromQuery<AppletEventsResponse>(
      eventsKey,
      this.queryClient,
    );

    return response?.result.events ?? null;
  }
}

export function mapEventFromDto(dto: ScheduleEventDto): ScheduleEvent {
  return {
    id: dto.id,
    entityId: dto.entityId,
    selectedDate: buildDateFromDto(dto.selectedDate),
    timers: {
      idleTimer: null,
      timer: null,
    },
    scheduledAt: null,
    availability: {
      allowAccessBeforeFromTime: dto.availability.allowAccessBeforeFromTime,
      availabilityType: dto.availabilityType as AvailabilityType,
      periodicityType: dto.availability.periodicityType as PeriodicityType,
      startDate: buildDateFromDto(dto.availability.startDate),
      endDate: buildDateFromDto(dto.availability.endDate),
      oneTimeCompletion: dto.availability.oneTimeCompletion,
      timeFrom: dto.availability.timeFrom,
      timeTo: dto.availability.timeTo,
    },
    notificationSettings: {
      notifications: [],
      reminder: null,
    },
  };
}
