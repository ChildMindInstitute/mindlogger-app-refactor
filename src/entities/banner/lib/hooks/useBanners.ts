import { useCallback } from 'react';

import { useAppDispatch } from '@app/shared/lib/hooks/redux';

import { BannerType, bannerActions } from '../../model/slice';
import { BannerProps } from '../../ui/Banner';

// Convenience type for adding banners using just a string, as well as a full BannerProps object.
// Supports null as well to accommodate t() return type.
type BannerContent = string | null | BannerProps;

export const useBanners = () => {
  const dispatch = useAppDispatch();

  const addBanner = useCallback(
    (key: BannerType, banner: BannerContent) => {
      const bannerProps =
        banner === null || typeof banner === 'string'
          ? { children: banner }
          : banner;

      dispatch(bannerActions.addBanner({ key, bannerProps }));
    },
    [dispatch],
  );

  const addSuccessBanner = useCallback(
    (banner: BannerContent) => {
      addBanner('SuccessBanner', banner);
    },
    [addBanner],
  );

  const addErrorBanner = useCallback(
    (banner: BannerContent) => {
      addBanner('ErrorBanner', banner);
    },
    [addBanner],
  );

  const addWarningBanner = useCallback(
    (banner: BannerContent) => {
      addBanner('WarningBanner', banner);
    },
    [addBanner],
  );

  const addInfoBanner = useCallback(
    (banner: BannerContent) => {
      addBanner('InfoBanner', banner);
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
