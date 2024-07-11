import { ActivityPipelineType } from '@app/abstract/lib';

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

export const selectNotCompletedEntities = (
  state: RootStateFrom,
  typeFilter: 'flows' | 'activities',
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
          (typeFilter === 'flows' &&
            payload.type === ActivityPipelineType.Regular) ||
          (typeFilter === 'activities' &&
            payload.type !== ActivityPipelineType.Regular)
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

export const getUpdatedReduxState = (
  stateFrom: RootStateFrom,
  progressTo: NotCompletedEntitiesTo[],
): RootStateTo => {
  let result: RootStateTo = {
    ...stateFrom,
    applets: {
      ...stateFrom.applets,
      inProgress: { ...stateFrom.applets.inProgress } as StoreProgressTo,
    },
  };

  for (const entity of progressTo) {
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
