import { useEffect, useRef } from 'react';

import NetInfo from '@react-native-community/netinfo';

import { Logger } from '../';

/*
The addEventListener is always fired on app start, so we ignore it by update the state from null to status.
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
        Logger.log('[useOnlineEstablished] Trigger');
        callback();
      }

      currentStateRef.current = status;
    });
  }, [callback]);
};

export default useOnlineEstablished;
