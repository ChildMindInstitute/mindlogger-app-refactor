import { useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Logger } from '@app/shared/lib';

import { RefreshService } from '../services';

const useRefreshMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const refreshService = useMemo(
    () => new RefreshService(queryClient, Logger),
    [queryClient],
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
