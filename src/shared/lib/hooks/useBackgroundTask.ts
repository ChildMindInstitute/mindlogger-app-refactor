import { useEffect, useRef } from 'react';

import { BackgroundWorker, BackgroundTaskOptions } from '../services';

function useBackgroundTask(
  callback: () => Promise<unknown>,
  options?: BackgroundTaskOptions,
) {
  const callbackRef = useRef(callback);
  const optionsRef = useRef(options);

  callbackRef.current = callback;

  useEffect(() => {
    const task = () => {
      return callbackRef.current();
    };

    BackgroundWorker.setTask(task, optionsRef.current);
  }, []);
}

export default useBackgroundTask;
