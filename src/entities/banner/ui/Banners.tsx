import { StatusBar } from 'react-native';

import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  IS_ANDROID,
  IS_IOS,
  OS_MAJOR_VERSION,
} from '@app/shared/lib/constants';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { BANNERS_DEFAULT_BG } from '@entities/banner/lib/constants.tsx';

import { Banner, BannerProps } from './Banner';
import { useBanners } from '../lib/hooks/useBanners';
import { bannersBgSelector, bannersSelector } from '../model/selectors';
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
  const bannersBg = useAppSelector(bannersBgSelector);
  const { top } = useSafeAreaInsets();

  // Animate top safe area background color to match native header background color transition
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bannersBg ?? BANNERS_DEFAULT_BG, {
      // Duration is based on native header transition duration for each OS
      // iOS: 350ms, Android: 300ms
      // Subtract 30ms to account for animation delay
      duration: IS_IOS ? 320 : 270,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          paddingTop: top,
          // There's weird white space on Android 15 and above because of the safe area insets
          // We can remove this negative bottom margin when this issue is resolved:
          // https://github.com/react-navigation/react-navigation/issues/12608
          marginBottom: IS_ANDROID && OS_MAJOR_VERSION >= 15 ? -top : 0,
          zIndex: 1000,
        },
      ]}
    >
      <StatusBar translucent />

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
