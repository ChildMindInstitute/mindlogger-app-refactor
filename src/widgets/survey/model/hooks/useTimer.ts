import { useEffect } from 'react';
import { useRef } from 'react';

import { HourMinute, getMsFromHours, getMsFromMinutes } from '@app/shared/lib';
import { AppTimer } from '@app/shared/lib';

type UseTimerInput = {
  onFinish: () => void;
  entityStartedAt: number;
  timerHourMinute?: HourMinute | null;
};

const useTimer = (input: UseTimerInput) => {
  const { onFinish, entityStartedAt, timerHourMinute } = input;

  const durationBySettings = timerHourMinute
    ? getMsFromHours(timerHourMinute.hours) + getMsFromMinutes(timerHourMinute.minutes)
    : 0;

  const timerLogicIsUsed = durationBySettings > 0;

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  useEffect(() => {
    if (!timerLogicIsUsed) {
      return;
    }

    const alreadyElapsed: number = Date.now() - entityStartedAt;

    const noTimeLeft: boolean = alreadyElapsed > durationBySettings;

    if (noTimeLeft) {
      finishRef.current();
      return;
    }

    const durationLeft = durationBySettings - alreadyElapsed;

    const timer = new AppTimer(() => finishRef.current(), false, durationLeft);

    timer.start();

    return () => {
      timer.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useTimer;
