import { useCallback, useRef } from 'react';

const useInterval = (
  onIntervalPass: (...args: any) => unknown,
  interval: number,
) => {
  const callbacksRef = useRef({ onIntervalPass });
  const intervalRef = useRef<IntervalId>();

  callbacksRef.current = { onIntervalPass };

  const start = useCallback(() => {
    const onIntervalIsUp = () => callbacksRef.current.onIntervalPass();

    onIntervalIsUp();

    intervalRef.current = setInterval(onIntervalIsUp, interval);
  }, [interval]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  return {
    start,
    stop,
  };
};

export default useInterval;
