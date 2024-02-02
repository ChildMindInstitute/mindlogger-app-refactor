import { useEffect, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

const useOnFocus = (callback: () => void) => {
  const isFocused = useIsFocused();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (isFocused) {
      callbackRef.current();
    }
  }, [isFocused]);
};

export default useOnFocus;
