import { useEffect } from 'react';
import { Image, Linking, StyleSheet } from 'react-native';

import { Trans } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { BannerOrder } from '@app/entities/banner/model/slice';
import { ScreenRoute } from '@app/screens/config/types';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { Link } from '@app/shared/ui/Link';
import { Text } from '@app/shared/ui/Text';
import { curiousIcon } from '@assets/images';

import { defaultBannersActions } from '../../model/slice';
import { REBRAND_BANNER_EXCLUDED_ROUTES } from '../constants';

export const useRebrandBanner = (
  dismissed: Record<string, string[]>,
  bannerScope: string,
  currentRouteName?: ScreenRoute,
) => {
  const dispatch = useAppDispatch();
  const { addBanner, removeBanner } = useBanners();

  useEffect(() => {
    // Do not add banner if previously dismissed
    if (dismissed[bannerScope]?.includes('BrandUpdateBanner')) {
      return;
    }

    // Only show the banner if not performing an assessment and we have a route name
    if (
      currentRouteName &&
      REBRAND_BANNER_EXCLUDED_ROUTES.includes(currentRouteName)
    ) {
      return;
    }

    addBanner(
      'BrandUpdateBanner',
      {
        children: (
          <Trans i18nKey="rebrandBanner:content">
            <Text color="#FDFCFC" fontWeight="700">
              We are rebranding!
            </Text>
            <Text color="#FDFCFC">
              Design updates are on the way—same great app, fresh new look.
              Curious?{' '}
            </Text>
            <Link
              textDecorationLine="underline"
              color="#B6DFFE"
              whiteSpace="nowrap"
              onPress={() =>
                Linking.openURL('https://www.gettingcurious.com/rebrand')
              }
            >
              Click here to learn more.
            </Link>
          </Trans>
        ),
        // NOTE: For an unknown reason, we cannot use Tamagui's <Image> here as it causes the app
        // to display a blank screen and become inoperable, only on release builds. It works fine
        // in debug builds. So we resort to RN's native <Image>.
        icon: <Image source={curiousIcon} style={styles.icon} />,
        color: '#FDFCFC',
        backgroundColor: '#0B0907',
        duration: null,
        onClose: reason => {
          if (reason === 'manual') {
            dispatch(
              defaultBannersActions.dismissBanner({
                key: bannerScope,
                bannerType: 'BrandUpdateBanner',
              }),
            );
          }
        },
      },
      BannerOrder.Top,
    );

    return () => {
      removeBanner('BrandUpdateBanner');
    };
  }, [
    dismissed,
    bannerScope,
    dispatch,
    addBanner,
    removeBanner,
    currentRouteName,
  ]);
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 30,
  },
});
