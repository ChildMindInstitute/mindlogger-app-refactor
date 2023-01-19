import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  accessToken: string | null;
};

const initialState: InitialState = {
  accessToken: null,
};

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    onAuthSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const identityReducer = identitySlice.reducer;
