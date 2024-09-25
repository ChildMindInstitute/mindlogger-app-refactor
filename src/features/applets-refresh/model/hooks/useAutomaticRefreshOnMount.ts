import { useEffect } from 'react';

import { useIsRestoring } from '@tanstack/react-query';

import { useRefreshMutation } from '@app/entities/applet/model/hooks/useRefreshMutation';
import { useCacheHasData } from '@app/shared/lib/hooks/useCacheHasData';

export function useAutomaticRefreshOnMount(onSuccess: () => void | Promise<void>) {
  const isCacheRestoring = useIsRestoring();
  const { mutate: refresh } = useRefreshMutation(onSuccess);
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
