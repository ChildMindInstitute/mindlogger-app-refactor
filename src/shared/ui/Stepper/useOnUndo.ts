import { useEffect, useRef } from 'react';

import { Emitter } from '@app/shared/lib/services/Emitter';

const EVENT_NAME = 'stepper:reset';

export function useOnUndo(callback: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const onReset = () => {
      callbackRef.current();
    };

    Emitter.on(EVENT_NAME, onReset);

    return () => {
      Emitter.off(EVENT_NAME, onReset);
    };
  }, []);
}

export const undoPressed = () => Emitter.emit(EVENT_NAME);
