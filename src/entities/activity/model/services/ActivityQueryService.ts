import { QueryClient } from '@tanstack/react-query';

import { ActivityResponse } from '@app/shared/api/services/IActivityService';
import {
  getDataFromQuery,
  getActivityDetailsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import { mapToActivity } from '../mappers';

export class ActivityQueryService {
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
