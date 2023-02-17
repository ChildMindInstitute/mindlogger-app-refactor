import { createSelector } from '@reduxjs/toolkit';

import { getFirstName } from '../lib';

const selectIdentity = (state: RootState) => state.identity;

export const selectUser = createSelector(
  selectIdentity,
  identity => identity.user,
);

export const selectEmail = createSelector(selectUser, user => user?.email);

export const selectFirstName = createSelector(selectUser, user => {
  if (!user) {
    return undefined;
  }

  return getFirstName(user.fullName);
});
