import { useCallback, useEffect } from 'react';

import { navigationRef } from '@app/app/lib';
import { AppClockTimer } from '@app/shared/lib';
// import { navigationService } from '@screens/lib';
import { useForceUpdate } from '@shared/lib';

const useActivityGroupsTimer = () => {
  // const currentRoute = navigationService.getCurrentRoute();
  // const executing = currentRoute?.route === 'InProgressActivity';
  const reRender = useForceUpdate();

  const onTick = useCallback(() => {
    const executing =
      navigationRef.getCurrentRoute()?.name === 'InProgressActivity';

    if (executing) {
      return;
    }
    reRender();
  }, [reRender]);

  useEffect(() => {
    const timer = new AppClockTimer(onTick, false);

    timer.start();

    return () => {
      timer.stop();
    };
  }, [onTick]);
};

export default useActivityGroupsTimer;
