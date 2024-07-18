import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useOnBackground(callback: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'background') {
        callbackRef.current();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export default useOnBackground;
