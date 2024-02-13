import { createSelector } from '@reduxjs/toolkit';

const selectIdentity = (state: RootState) => state.identity;

export const selectUser = createSelector(
  selectIdentity,
  (identity) => identity.user,
);

export const selectEmail = createSelector(selectUser, (user) => user?.email);

export const selectFirstName = createSelector(
  selectUser,
  (user) => user?.firstName,
);

export const selectUserId = createSelector(selectUser, (user) => user?.id);
