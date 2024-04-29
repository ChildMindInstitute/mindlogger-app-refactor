import { createSelector } from '@reduxjs/toolkit';

import {
  ActivityPipelineType,
  StoreEntitiesProgress,
  StoreEventsProgress,
  StoreProgressPayload,
} from '@app/abstract/lib';

const selectApplets = (state: RootState) => state.applets;

export const selectGlobalState = createSelector(
  (state: RootState) => state,
  state => ({ ...state }),
);

export const selectInProgressApplets = createSelector(
  selectApplets,
  applet => applet.inProgress,
);

export const selectInProgressEntities = createSelector(
  selectInProgressApplets,
  inProgressApplets => {
    const result: StoreEntitiesProgress = Object.values(
      inProgressApplets,
    ).reduce((progress, entityProgress) => {
      progress = {
        ...progress,
        ...entityProgress,
      };

      return progress;
    }, {});

    return result;
  },
);

export const selectCompletedEntities = createSelector(
  selectApplets,
  applet => applet.completedEntities,
);

export type NotCompletedEntity = {
  type: ActivityPipelineType;
  appletId: string;
  entityId: string;
  eventId: string;
  payload: StoreProgressPayload;
};

export const selectNotCompletedEntities = createSelector(
  selectInProgressApplets,
  inProgressApplets => {
    const result: NotCompletedEntity[] = [];

    const appletIds = Object.keys(inProgressApplets);

    for (const appletId of appletIds) {
      const progressEntities: StoreEntitiesProgress =
        inProgressApplets[appletId];

      const entityIds = Object.keys(progressEntities);

      for (const entityId of entityIds) {
        const progressEvents: StoreEventsProgress = progressEntities[entityId];

        const eventIds = Object.keys(progressEvents);

        for (const eventId of eventIds) {
          const payload: StoreProgressPayload = progressEvents[eventId];

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
  },
);

export const selectCompletions = createSelector(
  selectApplets,
  applet => applet.completions,
);
