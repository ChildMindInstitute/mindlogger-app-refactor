import { useMemo } from 'react';

import { QueryKey, useQueryClient } from '@tanstack/react-query';

import { AppletsResponse } from '@app/shared/api/services/IAppletService';

import { getDataFromQuery } from '../utils/reactQueryHelpers';

export const useCacheHasData = () => {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      check: (key: QueryKey = ['applets']): boolean => {
        const response = getDataFromQuery<AppletsResponse>(key, queryClient);

        return !!response?.result.length;
      },
    }),
    [queryClient],
  );
};
