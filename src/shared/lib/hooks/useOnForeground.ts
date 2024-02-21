import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

type Options = {
  enabled: boolean;
};

function useOnForeground(callback: () => void, options?: Partial<Options>) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active' && enabled) {
        callbackRef.current();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [enabled]);
}

export default useOnForeground;
