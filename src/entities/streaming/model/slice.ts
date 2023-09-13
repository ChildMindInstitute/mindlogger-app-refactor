import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = '8881';

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
});

export const actions = {
  ...streamingSlice.actions,
};

export const reducer = streamingSlice.reducer;
