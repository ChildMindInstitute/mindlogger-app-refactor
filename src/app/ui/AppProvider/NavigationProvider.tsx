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

import { DEEP_LINK_PREFIX, Logger } from '@app/shared/lib';

const LOGGER_MODULE_NAME = 'NavigationProvider';

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
      Logger.warn(
        `[${LOGGER_MODULE_NAME}] No matching route found, open URL in browser: ${DEEP_LINK_PREFIX}/${path}`,
      );

      // No matching route found, open URL in browser
      Linking.openURL(`${DEEP_LINK_PREFIX}/${path}`).catch(err =>
        Logger.error(
          `[${LOGGER_MODULE_NAME}] An error occurred opening deep link ${DEEP_LINK_PREFIX}/${path} in the browser:\n\n ${err}`,
        ),
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
      linking={DEEP_LINK_PREFIX ? linking : undefined}
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
