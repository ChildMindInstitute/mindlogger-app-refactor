import { useCallback, useEffect, useRef } from 'react';

import { Emitter } from '@shared/lib';

import { AutocompletionExecuteOptions, useAutoCompletionExecute } from './';

function useOnAutoCompletion(callback?: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const { executeAutocompletion } = useAutoCompletionExecute();

  const processAutocompletion = useCallback(
    (payload?: AutocompletionExecuteOptions) => {
      executeAutocompletion('unknown', payload);

      if (callbackRef.current) {
        callbackRef.current();
      }
    },
    [executeAutocompletion],
  );

  useEffect(() => {
    Emitter.on<AutocompletionExecuteOptions>(
      'autocomplete',
      processAutocompletion,
    );

    return () => {
      Emitter.off('autocomplete', processAutocompletion);
    };
  }, [processAutocompletion]);
}

export default useOnAutoCompletion;
