import { LookupEntityInput } from '@app/abstract/lib';
import { ActivityResponse, AppletDetailsResponse } from '@app/shared/api';
import {
  getActivityDetailsKey,
  getAppletDetailsKey,
  getDataFromQuery,
} from '@app/shared/lib';

import { ActivityModel } from '../..';
import { ActivityDetails } from '../../lib';

export type EntityActivitiesCollector = {
  collect: (input: LookupEntityInput) => ActivityDetails[];
};

const createEntityActivitiesCollector = (): EntityActivitiesCollector => {
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

      const activity: ActivityDetails = ActivityModel.mapToActivity(
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

      for (let activityId of activityIds) {
        addActivity(activityId);
      }
    }
    return result;
  }

  return {
    collect,
  };
};

export default createEntityActivitiesCollector();
