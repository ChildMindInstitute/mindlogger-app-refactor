import { useEffect, useRef } from 'react';

import NetInfo from '@react-native-community/netinfo';

const useOnlineEstablished = (callback: () => void) => {
  const currentStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = state.isConnected != null && state.isConnected && Boolean(state.isInternetReachable);

      if (!currentStateRef.current && status) {
        callback();
      }

      currentStateRef.current = status;
    });
  }, [callback]);
};

export default useOnlineEstablished;
