import { useQueryClient } from '@tanstack/react-query';

import { AppletModel, useAppletDetailsQuery } from '@app/entities/applet';
import { useEventsQuery } from '@app/entities/event/api';
import { useAppSelector } from '@app/shared/lib';

import useTimer from './useTimer';
import { ActivityListGroup } from '../../lib';
import { ActivityGroupsBuildManager } from '../services';

type UseActivityGroupsReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  error?:
    | ReturnType<typeof useAppletDetailsQuery>['error']
    | ReturnType<typeof useEventsQuery>['error'];
  groups: ActivityListGroup[];
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  useTimer();

  const queryClient = useQueryClient();

  const entitiesProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const groupsResult = ActivityGroupsBuildManager.process(
    appletId,
    entitiesProgress,
    queryClient,
  );

  return {
    groups: groupsResult.groups,
    isSuccess: true,
    isLoading: false,
    error: null,
  };
};
