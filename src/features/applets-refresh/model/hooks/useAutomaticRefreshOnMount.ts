import { useEffect, useState } from 'react';

import { useIsRestoring } from '@tanstack/react-query';

import { useRefreshMutation } from '@app/entities/applet/model/hooks/useRefreshMutation';
import { useCacheHasData } from '@app/shared/lib/hooks/useCacheHasData';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export function useAutomaticRefreshOnMount(
  onSuccess: () => void | Promise<void>,
) {
  const isCacheRestoring = useIsRestoring();
  const { mutateAsync: refresh } = useRefreshMutation(onSuccess);
  const { check: checkIfCacheHasData } = useCacheHasData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isCacheRestoring) {
      return;
    }

    const cacheHasData = checkIfCacheHasData();

    if (!cacheHasData) {
      setIsRefreshing(true);
      refresh()
        .then(() => setIsRefreshing(false))
        .catch(err => getDefaultLogger().error(err as never));
    }
  }, [checkIfCacheHasData, isCacheRestoring, refresh]);

  return { isRefreshing };
}
