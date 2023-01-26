import { createSelector } from '@reduxjs/toolkit';

const selectIdentity = (state: RootState) => state.identity;

export const selectUser = createSelector(
  selectIdentity,
  identity => identity.user,
);
