import { useEffect, useRef } from 'react';

import { getDefaultBackgroundWorker } from '../services/backgroundWorkerBuilderInstance';
import { BackgroundTaskOptions } from '../services/IBackgroundWorkerBuilder';

export function useBackgroundTask(
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

    getDefaultBackgroundWorker().setTask(task, optionsRef.current);
  }, []);
}
