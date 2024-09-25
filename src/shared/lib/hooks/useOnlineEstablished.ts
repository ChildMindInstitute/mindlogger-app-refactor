import { useEffect, useRef } from 'react';

import NetInfo from '@react-native-community/netinfo';

import { getDefaultLogger } from '../services/loggerInstance';

/*
The addEventListener is always fired on app start, so we ignore it by update the state from null to status.
*/
export const useOnlineEstablished = (callback: () => void) => {
  const currentStateRef = useRef<boolean | null>(null);

  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    return NetInfo.addEventListener(state => {
      const status =
        state.isConnected != null &&
        state.isConnected &&
        Boolean(state.isInternetReachable);

      if (currentStateRef.current === false && status) {
        getDefaultLogger().log('[useOnlineEstablished] Trigger');
        callbackRef.current();
      }

      currentStateRef.current = status;
    });
  }, []);
};
