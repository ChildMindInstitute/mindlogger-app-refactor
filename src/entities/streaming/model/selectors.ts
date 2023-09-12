import { createSelector } from '@reduxjs/toolkit';

const selectStreaming = (state: RootState) => state.streaming;

export const selectStreamingHistory = createSelector(
  selectStreaming,
  streaming => streaming.history,
);
