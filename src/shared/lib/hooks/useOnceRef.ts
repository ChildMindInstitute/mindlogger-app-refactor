import { useEffect, useRef } from 'react';

export const useOnceRef = (callback: () => void) => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);
};
