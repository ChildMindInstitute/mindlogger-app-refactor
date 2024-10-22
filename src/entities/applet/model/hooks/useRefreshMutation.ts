import { useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getDefaultAppletsService } from '@app/shared/api/services/appletsServiceInstance';
import { getDefaultEventsService } from '@app/shared/api/services/eventsServiceInstance';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';

import { selectGlobalState } from '../selectors';
import { ProgressSyncService } from '../services/ProgressSyncService';
import { RefreshService } from '../services/RefreshService';

export const useRefreshMutation = (onSuccess?: () => void | Promise<void>) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectGlobalState);
  const queryClient = useQueryClient();

  const progressSyncService = useMemo(
    () => new ProgressSyncService(state, dispatch, getDefaultLogger()),
    [dispatch, state],
  );

  const refreshService = useMemo(
    () =>
      new RefreshService(
        queryClient,
        getDefaultLogger(),
        progressSyncService,
        getDefaultAppletsService(),
        getDefaultEventsService(),
        getMutexDefaultInstanceManager(),
      ),
    [queryClient, progressSyncService],
  );

  const refresh = useMemo(
    () => refreshService.refresh.bind(refreshService),
    [refreshService],
  );

  return useMutation(['refresh'], refresh, {
    networkMode: 'always',
    onSuccess,
  });
};
