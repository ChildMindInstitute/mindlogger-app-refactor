import { FC, PropsWithChildren, useCallback } from 'react';
import { Linking } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
  getStateFromPath,
  NavigationState,
  PartialState,
  NavigationContainerProps,
} from '@react-navigation/native';

import { EntityPath } from '@app/abstract/lib/types/entity';
import { bannerActions } from '@app/entities/banner/model/slice';
import { RootStackParamList, ScreenRoute } from '@app/screens/config/types';
import { NavigationServiceScopes } from '@app/screens/lib/INavigationService';
import { getDefaultNavigationService } from '@app/screens/lib/navigationServiceInstance';
import { useInitialNavigationState } from '@app/screens/model/hooks/useInitialNavigationState';
import { DEEP_LINK_PREFIXES } from '@app/shared/lib/constants';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

const LOGGER_MODULE_NAME = 'NavigationProvider';

const SCREEN_BG_COLOR_OVERRIDES: ScreenRoute[] = [
  'Applets',
  'AppletDetails',
  'InProgressActivity',
  'ActivityPassedScreen',
  'Autocompletion',
];

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
  if (!DEEP_LINK_PREFIXES.length) {
    getDefaultLogger()[__DEV__ ? 'info' : 'error'](
      `[${LOGGER_MODULE_NAME}] No deep link prefixes found, deep linking will not work.`,
    );

    return undefined;
  }

  return {
    prefixes: DEEP_LINK_PREFIXES,
    getStateFromPath: (path, options) => {
      if (path.startsWith('/active-assessment')) {
        getDefaultLogger().info(
          `[${LOGGER_MODULE_NAME}] Found active assessment deep link, opening in app`,
        );

        const state = getDefaultNavigationService().getInitialNavigationState(
          NavigationServiceScopes.ActiveAssessment,
        );

        if (state) {
          // Flag the last route as coming from a deep link
          const lastRoute = state.routes[state.routes.length - 1];

          state.routes[state.routes.length - 1] = {
            ...lastRoute,
            params: {
              ...(lastRoute.params as EntityPath),
              fromActiveAssessmentLink: true,
            },
          };

          return state as unknown as PartialState<NavigationState>;
        }
      }

      const state = getStateFromPath(path, options);
      if (!state) {
        getDefaultLogger().warn(
          `[${LOGGER_MODULE_NAME}] No matching route found, open URL in browser: ${DEEP_LINK_PREFIXES[0]}${path}`,
        );

        // No matching route found, open URL in browser
        Linking.openURL(`${DEEP_LINK_PREFIXES[0]}${path}`).catch(err =>
          getDefaultLogger().error(
            `[${LOGGER_MODULE_NAME}] An error occurred opening deep link ${DEEP_LINK_PREFIXES[0]}${path} in the browser:\n\n ${err}`,
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
  const dispatch = useAppDispatch();
  const { isReady, initialNavigationState, onNavigationStateChanged } =
    useInitialNavigationState();

  const handleStateChange = useCallback(
    (state?: NavigationState<RootStackParamList>) => {
      if (!state) return;

      onNavigationStateChanged(state);

      // Set default screen background colour for Banners safe area container styling
      const currentScreen = state.routes[state.routes.length - 1];
      const hasDefaultBg = !SCREEN_BG_COLOR_OVERRIDES.includes(
        currentScreen.name,
      );
      if (hasDefaultBg) {
        dispatch(bannerActions.setBannersBg(undefined));
      }
    },
    [onNavigationStateChanged, dispatch],
  ) as NavigationContainerProps['onStateChange'];

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      theme={theme}
      linking={getLinking()}
      onStateChange={handleStateChange}
      initialState={initialNavigationState}
    >
      {children}
    </NavigationContainer>
  );
};
