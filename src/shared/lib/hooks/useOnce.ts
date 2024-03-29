import { useEffect, useRef } from 'react';

const useOnce = (callback: () => void) => {
  const currentStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (currentStateRef.current === null) {
      currentStateRef.current = true;
      callback();
    }
  }, [callback]);
};

export default useOnce;
