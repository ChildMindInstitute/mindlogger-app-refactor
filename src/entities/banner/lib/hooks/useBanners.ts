import { useCallback } from 'react';

import { useAppDispatch } from '@app/shared/lib/hooks/redux';

import { BannerOrder, BannerType, bannerActions } from '../../model/slice';
import { BannerProps } from '../../ui/Banner';

// Convenience type for adding banners using just a string, as well as a full BannerProps object.
// Supports null as well to accommodate t() return type.
type BannerContent = string | null | BannerProps;

export const useBanners = () => {
  const dispatch = useAppDispatch();

  const addBanner = useCallback(
    (key: BannerType, banner: BannerContent, order = BannerOrder.Default) => {
      const bannerProps =
        banner === null || typeof banner === 'string'
          ? { children: banner }
          : banner;

      dispatch(bannerActions.addBanner({ key, bannerProps, order }));
    },
    [dispatch],
  );

  const addSuccessBanner = useCallback(
    (banner: BannerContent, order = BannerOrder.Default) => {
      addBanner('SuccessBanner', banner, order);
    },
    [addBanner],
  );

  const addErrorBanner = useCallback(
    (banner: BannerContent, order = BannerOrder.Default) => {
      addBanner('ErrorBanner', banner, order);
    },
    [addBanner],
  );

  const addWarningBanner = useCallback(
    (banner: BannerContent, order = BannerOrder.Default) => {
      addBanner('WarningBanner', banner, order);
    },
    [addBanner],
  );

  const addInfoBanner = useCallback(
    (banner: BannerContent, order = BannerOrder.Default) => {
      addBanner('InfoBanner', banner, order);
    },
    [addBanner],
  );

  const removeBanner = useCallback(
    (key: BannerType) => {
      dispatch(bannerActions.removeBanner(key));
    },
    [dispatch],
  );

  const removeSuccessBanner = useCallback(() => {
    removeBanner('SuccessBanner');
  }, [removeBanner]);

  const removeErrorBanner = useCallback(() => {
    removeBanner('ErrorBanner');
  }, [removeBanner]);

  const removeWarningBanner = useCallback(() => {
    removeBanner('WarningBanner');
  }, [removeBanner]);

  const removeInfoBanner = useCallback(() => {
    removeBanner('InfoBanner');
  }, [removeBanner]);

  const removeAllBanners = useCallback(() => {
    dispatch(bannerActions.removeAllBanners());
  }, [dispatch]);

  return {
    addBanner,
    addSuccessBanner,
    addErrorBanner,
    addWarningBanner,
    addInfoBanner,
    removeBanner,
    removeSuccessBanner,
    removeErrorBanner,
    removeWarningBanner,
    removeInfoBanner,
    removeAllBanners,
  };
};
