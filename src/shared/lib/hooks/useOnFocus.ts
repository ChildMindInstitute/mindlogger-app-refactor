import { useCallback, useRef } from 'react';

import { useFocusEffect } from '@react-navigation/native';

const useOnFocus = (callback: () => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const focusHandler = useCallback(() => callbackRef.current(), []);

  useFocusEffect(focusHandler);
};

export default useOnFocus;
