import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { AppletDetailsResponse } from '@app/shared/api/services/IAppletService';

import {
  getDataFromQuery,
  getAppletDetailsKey,
} from '../utils/reactQueryHelpers';

export const useAppletInfo = () => {
  const queryClient = useQueryClient();

  const getName = useCallback(
    (id: string) => {
      const appletResponse = getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(id),
        queryClient,
      );
      return appletResponse?.result.displayName;
    },
    [queryClient],
  );

  return {
    getName,
  };
};
