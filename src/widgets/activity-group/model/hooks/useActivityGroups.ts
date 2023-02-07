import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity';
import { useAppletDetailsQuery } from '@app/entities/applet';
import { AppletDetailsDto } from '@app/shared/api';

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
      activityId: flowDto.id,
      eventId: '',
      description: activityDto!.description.en,
      name: activityDto!.name,
      image: flowDto.image,
      isInActivityFlow: true,
      isTimerSet: false,
      isAccessBeforeStartTime: false,
      isTimeIntervalSet: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeLeftToComplete: null,
    };

    activityItems.push(item);
  }

  for (let activityDto of activityDtos) {
    const item: ActivityListItem = {
      activityId: activityDto.id,
      eventId: '',
      description: activityDto.description.en,
      name: activityDto.name,
      image: activityDto.image,
      isInActivityFlow: false,
      isTimerSet: false,
      isAccessBeforeStartTime: false,
      isTimeIntervalSet: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeLeftToComplete: null,
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
