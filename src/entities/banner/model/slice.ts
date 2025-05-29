import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BANNERS } from '../lib/constants';
import { BannerProps } from '../ui/Banner';

export type BannerType = (typeof BANNERS)[number];

export enum BannerOrder {
  Top = 0,
  Default = 1,
  Bottom = 2,
}

type Banner = {
  key: BannerType;
  bannerProps: BannerProps;
  order: BannerOrder;
};

type InitialState = {
  banners: Banner[];
  bannersBg?: string;
};

const initialState: InitialState = {
  banners: [],
  bannersBg: undefined,
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    addBanner: (state, action: PayloadAction<Banner>) => {
      // @ts-expect-error Ignore TS error related to complex typing of Tamagui XStack
      state.banners.push(action.payload);
    },
    removeBanner: (state, action: PayloadAction<BannerType>) => {
      state.banners = state.banners.filter(
        banner => banner.key !== action.payload,
      );
    },
    removeAllBanners: state => {
      state.banners = [];
    },
    setBannersBg: (state, action: PayloadAction<string | undefined>) => {
      state.bannersBg = action.payload;
    },
  },
});

export const bannerActions = {
  ...bannerSlice.actions,
};

export const bannerReducer = bannerSlice.reducer;
