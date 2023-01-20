import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  accessToken: string | null;
};

const initialState: InitialState = {
  accessToken: null,
};

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    onAuthSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const actions = identitySlice.actions;

export const reducer = identitySlice.reducer;
