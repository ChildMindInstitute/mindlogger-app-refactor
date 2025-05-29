import { useEffect } from 'react';

import { Image } from '@tamagui/image';
import { Trans } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { ScreenRoute } from '@app/screens/config/types';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
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

    addBanner('BrandUpdateBanner', {
      children: (
        <Trans i18nKey="rebrandBanner:content">
          <Text color={colors.white} fontWeight="bold">
            Big updates are coming!
          </Text>
          <>New look, new name, same great product.</>
          {/* TODO: Add link when available
          https://mindlogger.atlassian.net/browse/M2-9276 */}
          {/* Curious?{' '}
          <Link
            textDecorationLine="underline"
            color="#B6DFFE"
            whiteSpace="nowrap"
            onPress={() => openUrl('https://mindlogger.org/brand-update')}
          >
            Tap to learn more.
          </Link>*/}
        </Trans>
      ),
      icon: <Image src={curiousIcon} width={32} height={30} />,
      color: colors.white,
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
    });

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
