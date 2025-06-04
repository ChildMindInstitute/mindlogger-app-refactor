import { createSelector } from '@reduxjs/toolkit';

const selectDefaultBanners = (state: RootState) => state.defaultBanners;

export const dismissedBannersSelector = createSelector(
  selectDefaultBanners,
  banners => banners.dismissedBanners,
);
