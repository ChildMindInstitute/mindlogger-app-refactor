import { QueryClient } from '@tanstack/react-query';

import {
  ActivityPipelineType,
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';
import {
  buildDateFromDto,
  getAppletDetailsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

import {
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletEventsResponse,
  ScheduleEventDto,
} from './MigrationDtoTypes0001';
import {
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadFrom,
  StoreProgressPayloadTo,
  StoreProgressTo,
} from './MigrationReduxTypes0001';

export type NotCompletedFlowsTo = {
  type: ActivityPipelineType;
  appletId: string;
  flowId: string;
  eventId: string;
  payload: StoreProgressPayloadTo;
};

export type NotCompletedFlowsFrom = {
  type: ActivityPipelineType;
  appletId: string;
  flowId: string;
  eventId: string;
  payload: StoreProgressPayloadFrom;
};

export const selectNotCompletedFlows = (
  state: RootStateFrom,
): NotCompletedFlowsFrom[] => {
  const inProgressApplets = state.applets.inProgress ?? {};
  const result: NotCompletedFlowsFrom[] = [];

  const appletIds = Object.keys(inProgressApplets);

  for (let appletId of appletIds) {
    const progressEntities = inProgressApplets[appletId] ?? {};

    const entityIds = Object.keys(progressEntities);

    for (let entityId of entityIds) {
      const progressEvents = progressEntities[entityId] ?? {};

      const eventIds = Object.keys(progressEvents);

      for (let eventId of eventIds) {
        const payload = progressEvents[eventId] ?? {};

        if (
          !progressEvents[eventId] ||
          payload.endAt ||
          payload.type === ActivityPipelineType.Regular
        ) {
          continue;
        }

        result.push({
          appletId,
          flowId: entityId,
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

export const getUpdatedReduxState = (
  stateFrom: RootStateFrom,
  progressFlowsTo: NotCompletedFlowsTo[],
): RootStateTo => {
  let result: RootStateTo = {
    ...stateFrom,
    applets: {
      ...stateFrom.applets,
      inProgress: { ...stateFrom.applets.inProgress } as StoreProgressTo,
    },
  };

  for (let flow of progressFlowsTo) {
    result = {
      ...result,
      applets: {
        ...result.applets,
        inProgress: {
          ...result.applets.inProgress,
          [flow.appletId]: {
            ...result.applets.inProgress[flow.appletId],
            [flow.flowId]: {
              ...result.applets.inProgress[flow.appletId][flow.flowId],
              [flow.eventId]: {
                ...result.applets.inProgress[flow.appletId][flow.flowId][
                  flow.eventId
                ],
                ...flow.payload,
              },
            },
          },
        },
      },
    };
  }

  return result;
};
