import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = '8881';

type History = {
  ipAddress: string;
  port: string;
  remember: boolean;
};

type InitialState = {
  history: History | null;
};

const initialState: InitialState = {
  history: {
    ipAddress: DEFAULT_HOST,
    port: DEFAULT_PORT,
    remember: false,
  },
};

const streamingSlice = createSlice({
  name: 'streaming',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<History>) => {
      const { ipAddress, port, remember } = action.payload;

      state.history = {
        ipAddress,
        port,
        remember,
      };
    },
    clearHistory: state => {
      state.history = null;
    },
    setDefaultHistory: state => {
      state.history = initialState.history;
    },
  },
});

export const actions = {
  ...streamingSlice.actions,
};

export const reducer = streamingSlice.reducer;
