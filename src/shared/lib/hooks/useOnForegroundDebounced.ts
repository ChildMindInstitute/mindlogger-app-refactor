import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useDebouncedCallback } from 'use-debounce';

type Options = {
  enabled: boolean;
};

const DebounceInterval = 100;

function useOnForegroundDebounced(
  callback: () => void,
  options?: Partial<Options>,
) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const previousStatusRef = useRef<AppStateStatus | null>(null);

  const previousStatus = previousStatusRef.current;

  const enabled = options?.enabled ?? true;

  const debouncedCallback = useDebouncedCallback((status: AppStateStatus) => {
    if (status === 'active' && status !== previousStatus && enabled) {
      callbackRef.current();
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
