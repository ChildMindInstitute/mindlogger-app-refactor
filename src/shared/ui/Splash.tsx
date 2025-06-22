import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import Animated, { FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEFAULT_BG } from '@app/entities/banner/lib/constants';
import { Text } from '@app/shared/ui/Text';

import { Spinner } from './Spinner';
import { APP_VERSION, ENV } from '../lib/constants';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export const SplashScreen = () => {
  const buildNumber = DeviceInfo.getBuildNumber();
  const { t } = useTranslation();

  const appVersion = ENV
    ? `${APP_VERSION} (${buildNumber}) ${ENV}`
    : APP_VERSION;

  return (
    <AnimatedSafeAreaView
      collapsable={false}
      exiting={FadeOut.duration(500)}
      style={style.container}
    >
      <Spinner />

      <Text position="absolute" bottom={30} color="$outline">
        {t('splash:version')} {appVersion}
      </Text>
    </AnimatedSafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DEFAULT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
