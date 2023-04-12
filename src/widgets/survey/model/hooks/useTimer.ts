import { useEffect } from 'react';
import { useRef } from 'react';

import { HourMinute, getMsFromHours, getMsFromMinutes } from '@app/shared/lib';
import { AppTimer } from '@app/shared/lib/timers';

type UseTimerInput = {
  onFinish: () => void;
  entityStartedAt: number;
  timerHourMinute?: HourMinute | null;
};

const useTimer = (input: UseTimerInput) => {
  const { onFinish, entityStartedAt, timerHourMinute } = input;

  const duration = timerHourMinute
    ? getMsFromHours(timerHourMinute.hours) +
      getMsFromMinutes(timerHourMinute.minutes)
    : 0;

  const timerLogicIsUsed = duration > 0;

  const timerRef = useRef<AppTimer | null>(null);

  useEffect(() => {
    if (!timerLogicIsUsed) {
      return () => {};
    }

    const alreadyElapsed: boolean = Date.now() - entityStartedAt > duration;

    if (alreadyElapsed) {
      onFinish();
      return () => {};
    }

    timerRef.current = new AppTimer(onElapsed, false, duration);

    timerRef.current!.start();

    return () => {
      timerRef.current!.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onElapsed = () => {
    onFinish();
  };
};

export default useTimer;
