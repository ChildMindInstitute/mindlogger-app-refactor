import { createSelector } from '@reduxjs/toolkit';

import { StoreEntitiesProgress } from '@app/abstract/lib';

const selectApplets = (state: RootState) => state.applets;

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

export const selectCompletions = createSelector(
  selectApplets,
  applet => applet.completions,
);
