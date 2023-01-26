import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  refreshingByPullToRefresh: boolean;
};

const initialState: InitialState = {
  refreshingByPullToRefresh: false,
};

const refreshAppletsIndicatorSlice = createSlice({
  name: 'refresh-applets-indicator',
  initialState,
  reducers: {
    onPullToRefresh: (state, action: PayloadAction<boolean>) => {
      state.refreshingByPullToRefresh = action.payload;
    },
  },
});

export const actions = refreshAppletsIndicatorSlice.actions;

export const reducer = refreshAppletsIndicatorSlice.reducer;
