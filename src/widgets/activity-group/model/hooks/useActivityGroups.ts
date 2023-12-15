import { useQueryClient } from '@tanstack/react-query';

import { AppletModel } from '@app/entities/applet';
import { useAppSelector } from '@app/shared/lib';

import useActivityGroupsTimer from './useActivityGroupsTimer';
import { ActivityListGroup } from '../../lib';
import { ActivityGroupsBuildManager } from '../services';

type UseActivityGroupsReturn = {
  isSuccess: boolean;
  error?: string | null;
  groups: ActivityListGroup[];
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  useActivityGroupsTimer();

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
    isSuccess: !groupsResult.isCacheInsufficientError,
    error: groupsResult.isCacheInsufficientError
      ? 'activity_list_component:insufficient_data_error'
      : null,
  };
};
