import { useEffect, useRef } from 'react';

import { Image } from '@tamagui/image';
import { Trans } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { Text } from '@app/shared/ui/Text';
import { curiousLogomark } from '@assets/images';

import { dismissedBannersSelector } from '../../model/selectors';
import { defaultBannersActions } from '../../model/slice';

export const useDefaultBanners = () => {
  const dispatch = useAppDispatch();
  const hasSession = useHasSession();
  const userId = useAppSelector(selectUserId);
  const { addBanner, removeBanner } = useBanners();

  const bannerKey = hasSession ? `user-${userId}` : 'global';

  const dismissed = useAppSelector(dismissedBannersSelector);
  // Save in ref to exclude from useEffect dependencies
  const dismissedRef = useRef(dismissed);

  useEffect(() => {
    dismissedRef.current = dismissed;
  }, [dismissed]);

  useEffect(() => {
    // Do not add banner if previously dismissed
    if (dismissedRef.current[bannerKey]?.includes('BrandUpdateBanner')) {
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
      icon: <Image src={curiousLogomark} width={32} height={30} />,
      color: colors.white,
      backgroundColor: '#0B0907',
      duration: null,
      onClose: reason => {
        if (reason === 'manual') {
          dispatch(
            defaultBannersActions.dismissBanner({
              key: bannerKey,
              bannerType: 'BrandUpdateBanner',
            }),
          );
        }
      },
    });

    return () => {
      removeBanner('BrandUpdateBanner');
    };
  }, [bannerKey, dispatch, addBanner, removeBanner]);
};
