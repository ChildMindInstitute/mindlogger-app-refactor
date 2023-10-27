import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { AppState } from 'react-native';

import { IS_ANDROID } from '@shared/lib';

function useRefreshResumeOnAppState(
  isRefreshing: boolean,
  setIsRefreshing: Dispatch<SetStateAction<boolean>>,
) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (IS_ANDROID) {
      return;
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isRefreshing) {
          setIsRefreshing(false);

          setTimeout(() => {
            setIsRefreshing(true);
          }, 350);
        }
      }

      appState.current = nextAppState;
    });

    return subscription.remove;
  }, [isRefreshing, setIsRefreshing]);
}

export default useRefreshResumeOnAppState;
