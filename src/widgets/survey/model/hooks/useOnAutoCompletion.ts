import { useCallback, useEffect, useRef } from 'react';

import { AutocompletionEventOptions } from '@app/abstract/lib';
import { Emitter } from '@shared/lib';

import { useAutoCompletionExecute } from './';

function useOnAutoCompletion(callback?: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const { executeAutocompletion } = useAutoCompletionExecute();

  const processAutocompletion = useCallback(
    (payload?: AutocompletionEventOptions) => {
      executeAutocompletion(payload!.logTrigger, payload);

      if (callbackRef.current) {
        callbackRef.current();
      }
    },
    [executeAutocompletion],
  );

  useEffect(() => {
    Emitter.on<AutocompletionEventOptions>(
      'autocomplete',
      processAutocompletion,
    );

    return () => {
      Emitter.off('autocomplete', processAutocompletion);
    };
  }, [processAutocompletion]);
}

export default useOnAutoCompletion;
