import { QueryClient } from '@tanstack/react-query';

import { ActivityResponse } from '@app/shared/api';
import { getActivityDetailsKey, getDataFromQuery } from '@app/shared/lib';

import { mapToActivity } from '../mappers';

class ActivityQueryService {
  constructor(private queryClient: QueryClient) {}

  getActivityDetails(activityId: string) {
    const data = getDataFromQuery<ActivityResponse>(
      getActivityDetailsKey(activityId),
      this.queryClient,
    );

    if (!data) {
      throw Error(
        `[AppletQueryStorage]: No data found for activity details, activityId:${activityId}`,
      );
    }

    return mapToActivity(data.result);
  }
}

export default ActivityQueryService;
