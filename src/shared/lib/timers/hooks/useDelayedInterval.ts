import { useCallback, useEffect, useRef } from 'react';

import { useInterval } from './useInterval';
import { useOnBackground } from '../../hooks/useOnBackground';
import { useOnceRef } from '../../hooks/useOnceRef';
import { useOnForegroundDebounced } from '../../hooks/useOnForegroundDebounced';
import { getDefaultLogger } from '../../services/loggerInstance';

const Interval = 60000;

const Delay = 5000;

export const useDelayedInterval = (onTick: () => void) => {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const onIntervalPass = useCallback(() => {
    onTickRef.current();
  }, []);

  const { start, stop } = useInterval(
    () => {
      getDefaultLogger().log('[useDelayedInterval:useInterval] Tick');
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
      getDefaultLogger().log(
        '[useDelayedInterval:startWithDelay] Timer started',
      );
      start();
    }, Delay);
  }, [start]);

  const onAppStart = useCallback(() => {
    getDefaultLogger().log('[useDelayedInterval:onAppStart] Timer stopped');

    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  const onForeground = useCallback(() => {
    getDefaultLogger().log('[useDelayedInterval:onForeground] Timer stopped');

    stop();

    startWithDelay();
  }, [startWithDelay, stop]);

  const onBackground = useCallback(() => {
    getDefaultLogger().log('[useDelayedInterval:onBackground] Timer stopped');

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
