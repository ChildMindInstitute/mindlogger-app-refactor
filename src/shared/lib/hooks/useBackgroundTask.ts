import { useEffect, useRef } from 'react';

import { BackgroundWorker, BackgroundTaskOptions } from '../services';

function useBackgroundTask(
  callback: () => void,
  options?: BackgroundTaskOptions,
) {
  const callbackRef = useRef(callback);
  const optionsRef = useRef(options);

  callbackRef.current = callback;

  useEffect(() => {
    const task = () => {
      callbackRef.current();
    };

    BackgroundWorker.setTask(task, optionsRef.current);
  }, []);
}

export default useBackgroundTask;
