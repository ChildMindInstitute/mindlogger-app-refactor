import { useQueryClient } from '@tanstack/react-query';

import { AppletModel } from '@app/entities/applet';
import { useAppSelector } from '@app/shared/lib';

import useTimer from './useTimer';
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

  const buildResult = (): UseActivityGroupsReturn => {
    const result: UseActivityGroupsReturn = {
      groups: groupsResult.groups,
      isSuccess:
        !groupsResult.isCacheInsufficientError && !groupsResult.otherError,
      error: null,
    };

    if (groupsResult.isCacheInsufficientError) {
      result.error = 'activity_list_component:insufficient_data_error';
    }
    if (groupsResult.otherError) {
      result.error = 'activity_list_component:other_error';
    }

    return result;
  };

  return buildResult();
};
