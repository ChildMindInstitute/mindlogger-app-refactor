import { useEffect } from 'react';

import { useIsRestoring } from '@tanstack/react-query';

import { useCacheHasData } from '@app/shared/lib';
import { AppletModel } from '@entities/applet';

function useAutomaticRefreshOnMount(onSuccess: () => void) {
  const isCacheRestoring = useIsRestoring();
  const { mutate: refresh } = AppletModel.useRefreshMutation(onSuccess);
  const { check: checkIfCacheHasData } = useCacheHasData();

  useEffect(() => {
    if (isCacheRestoring) {
      return;
    }

    const cacheHasData = checkIfCacheHasData();

    if (!cacheHasData) {
      refresh();
    }
  }, [checkIfCacheHasData, isCacheRestoring, refresh]);
}

export default useAutomaticRefreshOnMount;
