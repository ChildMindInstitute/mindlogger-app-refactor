import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

import { APP_VERSION, ENV, colors, IS_IOS } from '@shared/lib';

const WAIT_FOR_APP_TO_BE_READY = 'WAIT_FOR_APP_TO_BE_READY';
const FADE_OUT = 'FADE_OUT';
const HIDDEN = 'HIDDEN';

type SplashState =
  | typeof FADE_OUT
  | typeof WAIT_FOR_APP_TO_BE_READY
  | typeof HIDDEN;

const SplashScreen = ({ isAppReady }: { isAppReady: boolean }) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const appVersion = ENV ? `${APP_VERSION} ${ENV}` : APP_VERSION;

  const [state, setState] = useState<SplashState>(WAIT_FOR_APP_TO_BE_READY);

  useEffect(() => {
    if (!isAppReady) {
      containerOpacity.setValue(1);
      imageOpacity.setValue(0);

      setState(WAIT_FOR_APP_TO_BE_READY);
    }
  }, [containerOpacity, imageOpacity, isAppReady]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY && isAppReady) {
      setState(FADE_OUT);
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) {
    return null;
  }

  return (
    <Animated.View
      collapsable={false}
      style={[style.container, { opacity: containerOpacity }]}
    >
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
