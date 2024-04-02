import { useEffect, useRef } from 'react';

const useOnceRef = (callback: () => void) => {
  const currentStateRef = useRef<boolean>(false);

  useEffect(() => {
    if (!currentStateRef.current) {
      currentStateRef.current = true;
      callback();
    }
  }, [callback]);
};

export default useOnceRef;
