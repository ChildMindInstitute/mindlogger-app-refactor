import { RootState } from '@app/shared/lib/redux';

export const accessTokenSelector = (state: RootState) =>
  state.identityReducer.accessToken;
