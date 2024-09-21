import { createSelector } from '@reduxjs/toolkit';

import {
  EntityProgressionEntityType,
  EntityProgressionInProgress,
} from '@app/abstract/lib';

const selectApplets = (state: RootState) => state.applets;

export const selectGlobalState = createSelector(
  (state: RootState) => state,
  state => ({ ...state }),
);

export const selectAppletsEntityProgressions = createSelector(
  selectApplets,
  applet => applet.entityProgressions || [],
);

export const selectEntityResponseTimes = createSelector(
  selectApplets,
  applet => applet.entityResponseTimes || [],
);

export const selectConsents = createSelector(
  selectApplets,
  applets => applets.consents,
);

const selectAppletId = (_: unknown, appletId: string) => appletId;

export const selectAppletConsents = createSelector(
  [selectConsents, selectAppletId],
  (consents, appletId) => consents?.[appletId],
);

export type IncompleteEntity<TProgression = EntityProgressionInProgress> = {
  appletId: string;
  entityType: EntityProgressionEntityType;
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  progression: TProgression;
};

export const selectIncompletedEntities = createSelector(
  selectAppletsEntityProgressions,
  entityProgressions => {
    return entityProgressions
      .filter(progression => progression.status === 'in-progress')
      .map(progression => {
        return {
          appletId: progression.appletId,
          entityType: progression.entityType,
          entityId: progression.entityId,
          eventId: progression.eventId,
          targetSubjectId: progression.targetSubjectId,
          progression,
        } as IncompleteEntity;
      });
  },
);
