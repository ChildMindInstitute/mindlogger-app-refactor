import { LookupMediaInput } from '@app/abstract/lib';
import { ActivityDetails, ActivityModel } from '@app/entities/activity';
import { ActivityResponse, AppletDetailsResponse } from '@app/shared/api';
import {
  getActivityDetailsKey,
  getAppletDetailsKey,
  getDataFromQuery,
} from '@app/shared/lib';

const createMediaLookupService = () => {
  const lookupInMarkdown = (message: string): boolean => {
    const videoFound = message.includes('<video');
    const audioFound = message.includes('<audio');
    const youtubeFound = message.includes('youtu');

    return videoFound || audioFound || youtubeFound;
  };

  const lookupInActivity = (activity: ActivityDetails): boolean => {
    return activity.items.some(item => {
      return (
        lookupInMarkdown(item.question) || item.inputType === 'AudioPlayer'
      );
    });
  };

  const lookup = ({
    appletId,
    entityId,
    entityType,
    queryClient,
  }: LookupMediaInput): boolean => {
    const activitiesToLookup: ActivityDetails[] = [];

    const addActivity = (id: string) => {
      const activityResponse = getDataFromQuery<ActivityResponse>(
        getActivityDetailsKey(id),
        queryClient,
      );

      const activity: ActivityDetails = ActivityModel.mapToActivity(
        activityResponse!.result,
      );
      activitiesToLookup.push(activity);
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

    return activitiesToLookup.some(activity => {
      return lookupInActivity(activity);
    });
  };

  return {
    hasMediaReferences: lookup,
  };
};

export default createMediaLookupService();
