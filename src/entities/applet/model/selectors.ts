import { createSelector } from '@reduxjs/toolkit';

const selectApplets = (state: RootState) => state.applets;

export const selectInProgressApplets = createSelector(
  selectApplets,
  applet => applet.inProgress,
);

export const selectInProgressEntities = createSelector(
  selectInProgressApplets,
  inProgressApplets => {
    return Object.values(inProgressApplets).reduce(
      (progress, entityProgress) => {
        progress = {
          ...progress,
          ...entityProgress,
        };

        return progress;
      },
      {},
    );
  },
);

export const selectCompletedEntities = createSelector(
  selectApplets,
  applet => applet.completedEntities,
);
