import { useEffect, useRef } from 'react';

const useOnceRef = (callback: () => void) => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);
};

export default useOnceRef;
