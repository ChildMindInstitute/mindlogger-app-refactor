import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useDebouncedCallback } from 'use-debounce';

import { IS_IOS, Logger } from '../';

type Options = {
  enabled: boolean;
};

const DebounceInterval = 200;

function useOnForegroundDebounced(
  callback: () => void,
  options?: Partial<Options>,
) {
  const previousStatusRef = useRef<AppStateStatus | null>(null);

  const enabled = options?.enabled ?? true;

  const debouncedCallback = useDebouncedCallback((status: AppStateStatus) => {
    const previousStatus = previousStatusRef.current;

    const isStatusChanged = IS_IOS ? status !== previousStatus : true;

    if (status === 'active' && isStatusChanged && enabled) {
      Logger.log(
        '[useOnForegroundDebounced.useDebouncedCallback]: Call callback',
      );
      callback();
    }

    previousStatusRef.current = status;
  }, DebounceInterval);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', debouncedCallback);

    return () => {
      subscription.remove();
    };
  }, [debouncedCallback]);
}

export default useOnForegroundDebounced;
