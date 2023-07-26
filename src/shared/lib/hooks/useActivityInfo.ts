import { useQueryClient } from '@tanstack/react-query';

import { ActivityResponse } from '@app/shared/api';

import { getActivityDetailsKey, getDataFromQuery } from '../utils';

const useActivityInfo = () => {
  const queryClient = useQueryClient();

  const getName = (id: string) => {
    const activityResponse = getDataFromQuery<ActivityResponse>(
      getActivityDetailsKey(id),
      queryClient,
    );
    return activityResponse?.result.name;
  };

  return {
    getName,
  };
};

export default useActivityInfo;
