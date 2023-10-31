import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ActivityResponse } from '@app/shared/api';

import { getActivityDetailsKey, getDataFromQuery } from '../utils';

const useActivityInfo = () => {
  const queryClient = useQueryClient();

  const getName = useCallback(
    (id: string) => {
      const activityResponse = getDataFromQuery<ActivityResponse>(
        getActivityDetailsKey(id),
        queryClient,
      );
      return activityResponse?.result.name;
    },
    [queryClient],
  );

  return {
    getName,
  };
};

export default useActivityInfo;
