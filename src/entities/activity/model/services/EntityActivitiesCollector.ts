import { LookupEntityInput } from '@app/abstract/lib/types/entity';
import { ActivityResponse } from '@app/shared/api/services/IActivityService';
import { AppletDetailsResponse } from '@app/shared/api/services/IAppletService';
import {
  getDataFromQuery,
  getActivityDetailsKey,
  getAppletDetailsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import { IEntityActivitiesCollector } from './IEntityActivitiesCollector';
import { ActivityDetails } from '../../lib/types/activity';
import { mapToActivity } from '../mappers';

export const createEntityActivitiesCollector =
  (): IEntityActivitiesCollector => {
    function collect({
      appletId,
      entityId,
      entityType,
      queryClient,
    }: LookupEntityInput): ActivityDetails[] {
      const result: ActivityDetails[] = [];

      const addActivity = (id: string) => {
        const activityResponse = getDataFromQuery<ActivityResponse>(
          getActivityDetailsKey(id),
          queryClient,
        );

        const activity: ActivityDetails = mapToActivity(
          activityResponse!.result,
        );
        result.push(activity);
      };

      if (entityType === 'regular') {
        addActivity(entityId);
      }

      if (entityType === 'flow') {
        const appletDetailsResponse = getDataFromQuery<AppletDetailsResponse>(
          getAppletDetailsKey(appletId),
          queryClient,
        );

        const flowDto = appletDetailsResponse?.result.activityFlows.find(
          x => x.id === entityId,
        );

        const activityIds: string[] = flowDto!.activityIds;

        for (const activityId of activityIds) {
          addActivity(activityId);
        }
      }
      return result;
    }

    return {
      collect,
    };
  };
