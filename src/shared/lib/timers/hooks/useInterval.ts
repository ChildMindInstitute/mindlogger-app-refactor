import { useCallback, useRef } from 'react';

export const useInterval = (
  onIntervalPass: (...args: any) => unknown,
  interval: number,
  startImmediately: boolean | undefined = true,
) => {
  const callbacksRef = useRef({ onIntervalPass });
  const intervalRef = useRef<IntervalId>(undefined);

  callbacksRef.current = { onIntervalPass };

  const start = useCallback(() => {
    const onIntervalIsUp = () => callbacksRef.current.onIntervalPass();

    if (startImmediately) {
      onIntervalIsUp();
    }

    intervalRef.current = setInterval(onIntervalIsUp, interval);
  }, [interval, startImmediately]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  return {
    start,
    stop,
  };
};
