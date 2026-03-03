import { useCallback, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { isFlowResumeEnabled } from '@app/shared/lib/featureFlags/isFlowResumeEnabled';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { selectGlobalState } from '../selectors';
import { TargetedProgressSyncService } from '../services/TargetedProgressSyncService';

// Hook for syncing single applet's progress without full refresh
export const useTargetedSync = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectGlobalState);
  const queryClient = useQueryClient();
  const logger = getDefaultLogger();

  const syncService = useMemo(
    () => new TargetedProgressSyncService(state, dispatch, logger, queryClient),
    [state, dispatch, logger, queryClient],
  );

  const isSyncing = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncApplet = useCallback(
    async (appletId: string): Promise<void> => {
      // Skip targeted sync when cross-device flow sync is disabled for this applet
      if (!isFlowResumeEnabled(appletId)) {
        logger.log(
          `[useTargetedSync]: Cross-device sync disabled for applet ${appletId}, skipping`,
        );
        return;
      }

      if (isSyncing.current) {
        logger.log('[useTargetedSync]: Sync already in progress, skipping');
        return;
      }

      try {
        isSyncing.current = true;
        setIsRefreshing(true);
        await syncService.syncAppletProgress(appletId);
      } finally {
        isSyncing.current = false;
        setIsRefreshing(false);
      }
    },
    [syncService, logger],
  );

  return {
    syncApplet,
    isRefreshing,
  };
};
