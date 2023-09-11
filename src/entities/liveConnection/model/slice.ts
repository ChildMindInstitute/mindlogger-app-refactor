import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type History = {
  ipAddress: string;
  port: number;
};

type InitialState = {
  history: History | null;
};

const initialState: InitialState = {
  history: null,
};

const liveConnectionSlice = createSlice({
  name: 'liveConnection',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<History>) => {
      const { ipAddress, port } = action.payload;

      state.history = {
        ipAddress,
        port,
      };
    },
    clearHistory: state => {
      state.history = null;
    },
  },
});

export const actions = {
  ...liveConnectionSlice.actions,
};

export const reducer = liveConnectionSlice.reducer;
