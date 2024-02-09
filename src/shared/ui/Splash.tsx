import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Animated, { FadeOut } from 'react-native-reanimated';

import { APP_VERSION, ENV, colors, IS_IOS } from '@shared/lib';

const SplashScreen = () => {
  const buildNumber = DeviceInfo.getBuildNumber();

  const appVersion = ENV ? `${APP_VERSION} (${buildNumber}) ${ENV}` : APP_VERSION;

  return (
    <Animated.View collapsable={false} exiting={FadeOut.duration(500)} style={style.container}>
      <ActivityIndicator size="large" color={colors.secondary} />

      <View style={style.versionContainer}>
        <Text style={style.versionText}>Version: {appVersion}</Text>
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
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
    fontFamily: IS_IOS ? 'Avenir' : 'Roboto',
  },
});

export default SplashScreen;
