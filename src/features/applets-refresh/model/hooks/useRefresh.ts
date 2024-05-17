import { useState } from 'react';

import { AppletModel } from '@entities/applet';
import { IS_IOS, useOnForeground } from '@shared/lib';

function useRefresh(onSuccess: () => void) {
  const { mutateAsync: refresh } = AppletModel.useRefreshMutation(onSuccess);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useOnForeground(
    () => {
      if (isRefreshing) {
        setIsRefreshing(false);

        setTimeout(() => {
          setIsRefreshing(true);
        }, 350);
      }
    },
    { enabled: IS_IOS && isRefreshing },
  );

  const onRefresh = () => {
    refresh().then(() => setIsRefreshing(false));
    setIsRefreshing(true);
  };

  return {
    refresh: onRefresh,
    isRefreshing,
  };
}

export default useRefresh;
