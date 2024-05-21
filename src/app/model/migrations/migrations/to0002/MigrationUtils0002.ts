import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import { getAppletDetailsKey, getDataFromQuery } from '@app/shared/lib';

import {
  AppletDetailsDto,
  AppletDetailsResponse,
} from './MigrationDtoTypes0002';
import {
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadFrom,
  StoreProgressPayloadTo,
  StoreProgressTo,
} from './MigrationReduxTypes0002';

export type NotCompletedEntitiesTo = {
  type: ActivityPipelineType;
  appletId: string;
  entityId: string;
  eventId: string;
  payload: StoreProgressPayloadTo;
};

export type NotCompletedEntitiesFrom = {
  type: ActivityPipelineType;
  appletId: string;
  entityId: string;
  eventId: string;
  payload: StoreProgressPayloadFrom;
};

export const selectNotCompletedFlows = (
  state: RootStateFrom,
): NotCompletedEntitiesFrom[] => {
  const inProgressApplets = state.applets.inProgress ?? {};
  const result: NotCompletedEntitiesFrom[] = [];

  const appletIds = Object.keys(inProgressApplets);

  for (const appletId of appletIds) {
    const progressEntities = inProgressApplets[appletId] ?? {};

    const entityIds = Object.keys(progressEntities);

    for (const entityId of entityIds) {
      const progressEvents = progressEntities[entityId] ?? {};

      const eventIds = Object.keys(progressEvents);

      for (const eventId of eventIds) {
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

export const selectNotCompletedActivities = (
  state: RootStateFrom,
): NotCompletedEntitiesFrom[] => {
  const inProgressApplets = state.applets.inProgress ?? {};
  const result: NotCompletedEntitiesFrom[] = [];

  const appletIds = Object.keys(inProgressApplets);

  for (const appletId of appletIds) {
    const progressEntities = inProgressApplets[appletId] ?? {};
    const entityIds = Object.keys(progressEntities);

    for (const entityId of entityIds) {
      const progressEvents = progressEntities[entityId] ?? {};

      const eventIds = Object.keys(progressEvents);

      for (const eventId of eventIds) {
        const payload = progressEvents[eventId] ?? {};

        if (
          !progressEvents[eventId] ||
          payload.endAt ||
          payload.type !== ActivityPipelineType.Regular
        ) {
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
}

export const getUpdatedReduxState = (
  stateFrom: RootStateFrom,
  progressFlowsTo: NotCompletedEntitiesTo[],
): RootStateTo => {
  let result: RootStateTo = {
    ...stateFrom,
    applets: {
      ...stateFrom.applets,
      inProgress: { ...stateFrom.applets.inProgress } as StoreProgressTo,
    },
  };

  for (const entity of progressFlowsTo) {
    result = {
      ...result,
      applets: {
        ...result.applets,
        inProgress: {
          ...result.applets.inProgress,
          [entity.appletId]: {
            ...result.applets.inProgress[entity.appletId],
            [entity.entityId]: {
              ...result.applets.inProgress[entity.appletId][entity.entityId],
              [entity.eventId]: {
                ...result.applets.inProgress[entity.appletId][entity.entityId][
                  entity.eventId
                ],
                ...entity.payload,
              },
            },
          },
        },
      },
    };
  }

  return result;
};
