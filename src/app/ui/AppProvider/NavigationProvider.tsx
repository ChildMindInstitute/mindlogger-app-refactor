import { FC, PropsWithChildren } from 'react';
import { Linking } from 'react-native';

import {
  NavigationContainer,
  NavigationState,
  DefaultTheme,
  LinkingOptions,
  getStateFromPath,
} from '@react-navigation/native';
import { ScreensModel, RootStackParamList } from '@screens';
import Config from 'react-native-config';

import { DEEP_LINK_PREFIX } from '@app/shared/lib';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [DEEP_LINK_PREFIX!],
  getStateFromPath: (path, options) => {
    const state = getStateFromPath(path, options);
    if (!state) {
      console.log(
        `No matching route found, open URL in browser: ${DEEP_LINK_PREFIX}/${path}`,
      );
      // No matching route found, open URL in browser
      Linking.openURL(`${DEEP_LINK_PREFIX}/${path}`).catch(err =>
        console.error('An error occurred', err),
      );
    }
    return state;
  },
  config: {
    screens: {
      PasswordRecovery: 'password-recovery',
    },
  },
};

const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer
      theme={theme}
      linking={Config.DEEP_LINK_PREFIX ? linking : undefined}
      onStateChange={state =>
        ScreensModel.onScreenChanged(
          // @react-navigation's poor type inference
          state as NavigationState<RootStackParamList>,
        )
      }
    >
      {children}
    </NavigationContainer>
  );
};

export default NavigationProvider;
