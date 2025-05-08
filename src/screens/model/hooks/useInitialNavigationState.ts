import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { NavigationState } from '@react-navigation/routers';

import { RootStackParamList } from '@app/screens/config/types';
import { NavigationServiceScopes } from '@app/screens/lib/INavigationService';
import { getDefaultNavigationService } from '@app/screens/lib/navigationServiceInstance';

export const useInitialNavigationState = () => {
  const [initialNavigationState, setInitialNavigationState] = useState<
    NavigationState<RootStackParamList> | undefined
  >();
  const [isReady, setIsReady] = useState(false);

  const onNavigationStateChanged = useCallback(
    (navigationState?: NavigationState<RootStackParamList>) => {
      if (!navigationState) {
        return;
      }

      const history = navigationState.routes;
      const currentScreen = history[history.length - 1];

      switch (currentScreen.name) {
        case 'AppletDetails':
          getDefaultNavigationService().setInitialNavigationState(
            navigationState,
            NavigationServiceScopes.Default,
          );
          break;

        case 'InProgressActivity':
          getDefaultNavigationService().setInitialNavigationState(
            navigationState,
            NavigationServiceScopes.ActiveAssessment,
          );
          break;

        default:
          getDefaultNavigationService().clearInitialNavigationState(
            NavigationServiceScopes.Default,
          );
          break;
      }
    },
    [],
  );

  // Restore appropriate initial navigation state based on possible deep link
  useEffect(() => {
    const restoreState = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (!initialUrl) {
        // If no deep link, restore default saved navigation state
        const state = getDefaultNavigationService().getInitialNavigationState(
          NavigationServiceScopes.Default,
        );

        setInitialNavigationState(state);
      }
    };

    if (!isReady) {
      restoreState().finally(() => setIsReady(true));
    }
  }, [isReady]);

  return {
    isReady,
    initialNavigationState,
    onNavigationStateChanged,
  };
};
