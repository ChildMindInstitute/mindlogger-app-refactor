import { FC, PropsWithChildren } from 'react';

import {
  NavigationContainer,
  NavigationState,
  DefaultTheme,
  LinkingOptions,
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
