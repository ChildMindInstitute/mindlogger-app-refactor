import { useCallback, useRef } from 'react';

import { useInterval, useOnForegroundDebounced, useOnceRef } from '../../';

const Interval = 30000;

const Delay = 5000;

type Props = {
  onTick: () => unknown;
};

const useDelayedInterval = ({ onTick }: Props) => {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const onIntervalPass = useCallback(() => {
    onTickRef.current();
  }, []);

  const { start, stop } = useInterval(onIntervalPass, Interval);

  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startWithDelay = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    delayTimeoutRef.current = setTimeout(() => {
      start();
    }, Delay);
  }, [start]);

  const onAppStart = useCallback(() => {
    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  const onForeground = useCallback(() => {
    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  useOnceRef(onAppStart);

  useOnForegroundDebounced(onForeground);
};

export default useDelayedInterval;
