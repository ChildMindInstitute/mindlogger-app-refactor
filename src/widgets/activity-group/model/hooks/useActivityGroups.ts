import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity';
import { useAppletDetailsQuery } from '@app/entities/applet';
import { AppletDetailsDto } from '@app/shared/lib';

import groupMocks from './mocks';
import {
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
} from '../../lib';

type UseActivityGroupsReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  error?: ReturnType<typeof useAppletDetailsQuery>['error'];
  groups: ActivityListGroup[];
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  const returnMocks = false;

  const {
    data: detailsResponse,
    isLoading,
    isSuccess,
    error,
  } = useAppletDetailsQuery(appletId);

  if (returnMocks) {
    return {
      groups: groupMocks,
      isSuccess,
      isLoading,
      error,
    };
  }

  const appletDetails: AppletDetailsDto | undefined =
    detailsResponse?.data?.result;

  if (!appletDetails) {
    return {
      groups: [],
      isSuccess,
      isLoading,
      error,
    };
  }

  const groups: ActivityListGroup[] = [
    {
      type: ActivityGroupType.Available,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      activities: [],
    },
  ];

  const activityItems = groups[0].activities;

  const activityFlowDtos = appletDetails.activityFlows;

  const activityDtos = appletDetails.activities;

  for (let flowDto of activityFlowDtos) {
    if (!flowDto.items.length) {
      continue;
    }

    const activityDto = activityDtos.find(
      x => x.id === flowDto.items[0].activityId,
    );

    const item: ActivityListItem = {
      id: flowDto.id,
      description: activityDto!.description.en,
      name: activityDto!.name,
      image: flowDto.image,
      hasEventContext: false,
      isInActivityFlow: true,
      activityFlowName: flowDto.name,
      activityPositionInFlow: 1,
      numberOfActivitiesInFlow: flowDto.items.length,
      showActivityFlowBadge: true,
      isTimedActivityAllow: false,
      isTimeoutAccess: false,
      isTimeoutAllow: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeToComplete: null,
    };

    activityItems.push(item);
  }

  for (let activityDto of activityDtos) {
    const item: ActivityListItem = {
      id: activityDto.id,
      description: activityDto.description.en,
      name: activityDto.name,
      image: activityDto.image,
      hasEventContext: false,
      isInActivityFlow: false,
      activityFlowName: null,
      activityPositionInFlow: null,
      numberOfActivitiesInFlow: null,
      showActivityFlowBadge: false,
      isTimedActivityAllow: false,
      isTimeoutAccess: false,
      isTimeoutAllow: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeToComplete: null,
    };

    activityItems.push(item);
  }

  return {
    isLoading,
    isSuccess,
    error,
    groups,
  };
};
