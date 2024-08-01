import { useCallback, useEffect, useRef } from 'react';

import {
  Logger,
  useInterval,
  useOnForegroundDebounced,
  useOnceRef,
} from '../../';
import useOnBackground from '../../hooks/useOnBackground';

const Interval = 60000;

const Delay = 5000;

const useDelayedInterval = (onTick: () => void) => {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const onIntervalPass = useCallback(() => {
    onTickRef.current();
  }, []);

  const { start, stop } = useInterval(
    () => {
      Logger.log('[useDelayedInterval:useInterval] Tick');
      onIntervalPass();
    },
    Interval,
    false,
  );

  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startWithDelay = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    delayTimeoutRef.current = setTimeout(() => {
      Logger.log('[useDelayedInterval:startWithDelay] Timer started');
      start();
    }, Delay);
  }, [start]);

  const onAppStart = useCallback(() => {
    Logger.log('[useDelayedInterval:onAppStart] Timer stopped');

    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  const onForeground = useCallback(() => {
    Logger.log('[useDelayedInterval:onForeground] Timer stopped');

    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  const onBackground = useCallback(() => {
    Logger.log('[useDelayedInterval:onBackground] Timer stopped');

    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    stop();
  }, [stop]);

  useOnceRef(onAppStart);

  useOnForegroundDebounced(onForeground);

  useOnBackground(onBackground);

  useEffect(() => {
    return () => {
      stop();

      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useDelayedInterval;
