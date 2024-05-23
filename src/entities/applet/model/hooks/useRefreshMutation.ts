import { useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Logger, useAppDispatch, useAppSelector } from '@app/shared/lib';

import { AppletIntegrationsService } from '../integrations';
import { selectGlobalState } from '../selectors';
import { ProgressSyncService, RefreshService } from '../services';

const useRefreshMutation = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectGlobalState);
  const queryClient = useQueryClient();

  const progressSyncService = useMemo(
    () => new ProgressSyncService(state, dispatch, Logger),
    [dispatch, state],
  );

  const appletIntegrationService = useMemo(
    () => new AppletIntegrationsService(state, dispatch, Logger),
    [dispatch, state],
  );

  const refreshService = useMemo(
    () =>
      new RefreshService(
        queryClient,
        Logger,
        progressSyncService,
        appletIntegrationService,
      ),
    [queryClient, progressSyncService, appletIntegrationService],
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

export default useRefreshMutation;
