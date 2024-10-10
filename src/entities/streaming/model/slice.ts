import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { cleanUpAction } from '@app/shared/lib/redux-state/actions';

const DEFAULT_HOST = '';
const DEFAULT_PORT = '';

type StreamingState = {
  ipAddress: string;
  port: string;
  remember: boolean;
};

const initialState: StreamingState = {
  ipAddress: DEFAULT_HOST,
  port: DEFAULT_PORT,
  remember: false,
};

const streamingSlice = createSlice({
  name: 'streaming',
  initialState,
  reducers: {
    connectionEstabilished: (state, action: PayloadAction<StreamingState>) => {
      const { ipAddress, port, remember } = action.payload;

      return {
        ipAddress,
        port,
        remember,
      };
    },
    reset: () => {
      return initialState;
    },
  },
  extraReducers: builder =>
    builder.addCase(cleanUpAction, () => {
      return initialState;
    }),
});

export const streamingAction = {
  ...streamingSlice.actions,
};

export const streamingReducer = streamingSlice.reducer;
