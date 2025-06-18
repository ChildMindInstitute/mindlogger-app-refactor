import { StyleSheet, ActivityIndicator, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import Animated, { FadeOut } from 'react-native-reanimated';

import { Text } from '@app/shared/ui/Text';

import { APP_VERSION, ENV } from '../lib/constants';
import { palette } from '../lib/constants/palette';

export const SplashScreen = () => {
  const buildNumber = DeviceInfo.getBuildNumber();
  const { t } = useTranslation();

  const appVersion = ENV
    ? `${APP_VERSION} (${buildNumber}) ${ENV}`
    : APP_VERSION;

  return (
    <Animated.View
      collapsable={false}
      exiting={FadeOut.duration(500)}
      style={style.container}
    >
      <ActivityIndicator size="large" color={palette.secondary} />

      <View style={style.versionContainer}>
        <Text style={style.versionText}>
          {t('splash:version')} {appVersion}
        </Text>
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 30,
  },
  versionText: {
    color: 'white',
  },
});
