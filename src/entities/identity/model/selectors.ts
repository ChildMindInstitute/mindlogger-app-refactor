import { createSelector } from '@reduxjs/toolkit';

import { TokenStorage } from '@shared/lib';

const selectIdentity = (state: RootState) => state.identity;

export const selectUser = createSelector(
  selectIdentity,
  identity => identity.user,
);

export const selectIsAuthenticated = createSelector(selectUser, () =>
  TokenStorage.getString('accessToken'),
);
