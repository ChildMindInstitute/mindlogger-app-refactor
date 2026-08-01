import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {
  IS_ANDROID,
  IS_IOS,
  OS_MAJOR_VERSION,
} from '@app/shared/lib/constants';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useStableTopInset } from '@app/shared/lib/hooks/useStableTopInset';
import { DEFAULT_BG } from '@entities/banner/lib/constants';

import { Banner, BannerProps } from './Banner';
import { useBanners } from '../lib/hooks/useBanners';
import {
  bannersBgSelector,
  bannersHiddenSelector,
  bannersSelector,
} from '../model/selectors';
import { BannerType } from '../model/slice';

const handleClose = (
  removeBanner: (key: BannerType) => void,
  { key, bannerProps }: { key: BannerType; bannerProps: BannerProps },
  reason?: 'timeout' | 'manual',
) => {
  removeBanner(key);
  bannerProps?.onClose?.(reason);
};

export const Banners = () => {
  const { removeBanner } = useBanners();
  const banners = useAppSelector(bannersSelector);
  const bannersBg = useAppSelector(bannersBgSelector) ?? DEFAULT_BG;
  const isHidden = useAppSelector(bannersHiddenSelector);
  // Use a stable inset so the banners strip keeps reserving the status bar
  // space while the status bar is hidden during an activity. This prevents
  // the whole app layout from shifting when the status bar hides/shows.
  const top = useStableTopInset();

  // Animate the strip's height to 0 when Unity takes over the full screen
  // (isHidden), instead of unmounting and causing a layout jump. The strip
  // stays mounted so re-expanding on Unity exit is also smooth.
  const animatedHeight = useSharedValue(isHidden ? 0 : top);
  const animatedMargin = useSharedValue(
    isHidden ? 0 : IS_ANDROID && OS_MAJOR_VERSION >= 15 ? -top : 0,
  );

  useEffect(() => {
    const timingConfig = {
      duration: 250,
      easing: Easing.out(Easing.ease),
    };

    if (isHidden) {
      animatedHeight.value = withTiming(0, timingConfig);
      animatedMargin.value = withTiming(0, timingConfig);
    } else {
      animatedHeight.value = withTiming(top, timingConfig);
      animatedMargin.value = withTiming(
        IS_ANDROID && OS_MAJOR_VERSION >= 15 ? -top : 0,
        timingConfig,
      );
    }
  }, [isHidden, top, animatedHeight, animatedMargin]);

  // Animate top safe area background color to match native header background color transition
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bannersBg, {
      // Duration is based on native header transition duration for each OS
      // iOS: 350ms, Android: 300ms
      // Subtract 30ms to account for animation delay
      duration: IS_IOS ? 320 : 270,
      easing: Easing.out(Easing.ease),
    }),
    paddingTop: animatedHeight.value,
    // There's weird white space on Android 15 and above because of the safe area insets
    // We can remove this negative bottom margin when this issue is resolved:
    // https://github.com/react-navigation/react-navigation/issues/12608
    marginBottom: animatedMargin.value,
  }));

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          zIndex: 1000,
          overflow: 'hidden',
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={bannersBg}
      />

      {sortedBanners.map(({ key, bannerProps }) => (
        <Animated.View key={key} entering={FadeInUp} exiting={FadeOutUp}>
          <Banner
            {...bannerProps}
            onClose={reason =>
              handleClose(removeBanner, { key, bannerProps }, reason)
            }
          />
        </Animated.View>
      ))}
    </Animated.View>
  );
};
