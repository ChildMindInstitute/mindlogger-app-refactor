import { createSelector } from '@reduxjs/toolkit';

const selectBanners = (state: RootState) => state.banners;

export const bannersSelector = createSelector(
  selectBanners,
  banners => banners.banners,
);
