import { createSelector } from '@reduxjs/toolkit';

const selectStreaming = (state: RootState) => state.streaming;

export const selectStreamingSettings = createSelector(selectStreaming, (streaming) => streaming);
