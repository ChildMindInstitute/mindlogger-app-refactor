import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type InitialState = {
  user: User | null;
};

const initialState: InitialState = {
  user: null,
};

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    onAuthSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const identityActions = {
  ...identitySlice.actions,
};

export const identityReducer = identitySlice.reducer;
