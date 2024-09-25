import { useState } from 'react';

import { useRefreshMutation } from '@app/entities/applet/model/hooks/useRefreshMutation';
import { IS_IOS } from '@app/shared/lib/constants';
import { useOnForeground } from '@app/shared/lib/hooks/useOnForeground';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export function useRefresh(onSuccess: () => void | Promise<void>) {
  const { mutateAsync: refresh } = useRefreshMutation(onSuccess);

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
    refresh()
      .then(() => setIsRefreshing(false))
      .catch(err => getDefaultLogger().error(err as never));
    setIsRefreshing(true);
  };

  return {
    refresh: onRefresh,
    isRefreshing,
  };
}
