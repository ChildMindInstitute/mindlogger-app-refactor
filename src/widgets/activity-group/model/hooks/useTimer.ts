import { useCallback, useEffect, useState } from 'react';

import { AppClockTimer } from '@app/shared/lib/timers/AppClockTimer';

export const useTimer = () => {
  const [, reRender] = useState(false);

  const onTick = useCallback(() => {
    reRender(x => !x);
  }, []);

  useEffect(() => {
    const timer = new AppClockTimer(onTick, false);

    timer.start();

    return () => {
      timer.stop();
    };
  }, [onTick]);
};
