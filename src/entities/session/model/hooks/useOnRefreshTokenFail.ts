import { useEffect, useRef } from 'react';

import { Emitter } from '@app/shared/lib/services/Emitter';

export function useOnRefreshTokenFail(callback: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    function onRefreshTokenFail() {
      callbackRef.current();
    }

    Emitter.on('refresh-token-fail', onRefreshTokenFail);

    return () => {
      Emitter.off('refresh-token-fail', onRefreshTokenFail);
    };
  }, []);
}
