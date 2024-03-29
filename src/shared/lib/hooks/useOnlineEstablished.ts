import { useEffect, useRef } from 'react';

import NetInfo from '@react-native-community/netinfo';

/*
When the app just started - the event is fired, so that we ignore this moment and we
just set the initial value of network state.
When the app is just working and the real network status change occurred - callback will be triggered.
*/
const useOnlineEstablished = (callback: () => void) => {
  const currentStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    return NetInfo.addEventListener(state => {
      const status =
        state.isConnected != null &&
        state.isConnected &&
        Boolean(state.isInternetReachable);

      if (currentStateRef.current === false && status) {
        callback();
      }

      currentStateRef.current = status;
    });
  }, [callback]);
};

export default useOnlineEstablished;
