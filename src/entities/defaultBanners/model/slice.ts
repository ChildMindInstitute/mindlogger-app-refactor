import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BannerType } from '@app/entities/banner/model/slice';

type InitialState = {
  dismissedBanners: Record<string, BannerType[]>;
};

const initialState: InitialState = {
  dismissedBanners: {},
};

const defaultBannersSlice = createSlice({
  name: 'defaultBanners',
  initialState,
  reducers: {
    dismissBanner: (
      state,
      action: PayloadAction<{ key: string; bannerType: BannerType }>,
    ) => {
      const banners = state.dismissedBanners[action.payload.key] || [];
      state.dismissedBanners[action.payload.key] = [
        ...banners,
        action.payload.bannerType,
      ];
    },
  },
});

export const defaultBannersActions = {
  ...defaultBannersSlice.actions,
};

export const defaultBannersReducer = defaultBannersSlice.reducer;
