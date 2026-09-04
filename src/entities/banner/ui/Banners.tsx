import { StatusBar } from 'react-native';

import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IS_IOS } from '@app/shared/lib/constants';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
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
  const { top } = useSafeAreaInsets();

  // Animate top safe area background color to match native header background color transition
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bannersBg, {
      // Duration is based on native header transition duration for each OS
      // iOS: 350ms, Android: 300ms
      // Subtract 30ms to account for animation delay
      duration: IS_IOS ? 320 : 270,
      easing: Easing.out(Easing.ease),
    }),
  }));

  if (isHidden) {
    return null;
  }

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          // Add top inset here instead of letting react-native-screens 4.17+ pad the header
          paddingTop: top,
          zIndex: 1000,
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
