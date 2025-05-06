import { FC, PropsWithChildren } from 'react';
import { Linking } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
  getStateFromPath,
  NavigationState,
} from '@react-navigation/native';

import { useInitialNavigationState } from '@app/screens/model/hooks/useInitialNavigationState';
import { DEEP_LINK_PREFIX } from '@app/shared/lib/constants';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

const LOGGER_MODULE_NAME = 'NavigationProvider';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const getLinking = ():
  | LinkingOptions<ReactNavigation.RootParamList>
  | undefined => {
  if (!DEEP_LINK_PREFIX) {
    getDefaultLogger()[__DEV__ ? 'info' : 'error'](
      `[${LOGGER_MODULE_NAME}] No deep link prefix found, deep linking will not work.`,
    );

    return undefined;
  }

  return {
    prefixes: [DEEP_LINK_PREFIX],
    getStateFromPath: (path, options) => {
      const state = getStateFromPath(path, options);
      if (!state) {
        getDefaultLogger().warn(
          `[${LOGGER_MODULE_NAME}] No matching route found, open URL in browser: ${DEEP_LINK_PREFIX}/${path}`,
        );

        // No matching route found, open URL in browser
        Linking.openURL(`${DEEP_LINK_PREFIX}/${path}`).catch(err =>
          getDefaultLogger().error(
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
};

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isReady, initialNavigationState, onNavigationStateChanged } =
    useInitialNavigationState();

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      theme={theme}
      linking={getLinking()}
      onStateChange={
        onNavigationStateChanged as (state?: NavigationState) => void
      }
      initialState={initialNavigationState}
    >
      {children}
    </NavigationContainer>
  );
};
