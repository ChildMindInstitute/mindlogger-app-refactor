import { useEffect } from 'react';
import { useRef } from 'react';

import { HourMinute, getMsFromHours, getMsFromMinutes } from '@app/shared/lib';
import { AppTimer } from '@app/shared/lib';

type UseIdleTimerInput = {
  onFinish: () => void;
  hourMinute?: HourMinute | null;
};

type UseIdleTimerResult = {
  restart: () => void;
};

const useIdleTimer = (input: UseIdleTimerInput): UseIdleTimerResult => {
  const { onFinish, hourMinute } = input;

  const duration = hourMinute
    ? getMsFromHours(hourMinute.hours) + getMsFromMinutes(hourMinute.minutes)
    : 0;

  const idleLogicIsUsed = duration > 0;

  const timerRef = useRef<AppTimer | null>(null);

  const timer = timerRef.current;

  useEffect(() => {
    if (!idleLogicIsUsed) {
      return () => {};
    }

    timerRef.current = new AppTimer(onIdleElapsed, false, duration);

    timerRef.current.start();

    return () => {
      timerRef.current!.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onIdleElapsed = () => {
    onFinish();
  };

  const restart = () => {
    timer?.restart();
  };

  return {
    restart,
  };
};

export default useIdleTimer;
