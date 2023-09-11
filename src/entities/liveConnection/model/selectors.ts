import { createSelector } from '@reduxjs/toolkit';

const selectLiveConnection = (state: RootState) => state.liveConnection;

export const selectLiveConnectionHistory = createSelector(
  selectLiveConnection,
  liveConnection => liveConnection.history,
);
