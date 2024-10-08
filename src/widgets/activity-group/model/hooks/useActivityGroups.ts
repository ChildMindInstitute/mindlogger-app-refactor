import { useQueryClient } from '@tanstack/react-query';

import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { useTimer } from './useTimer';
import { ActivityListGroup } from '../../lib/types/activityGroup';
import { getDefaultActivityGroupsBuildManager } from '../services/activityGroupsBuildManagerInstance';

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

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  const groupsResult = getDefaultActivityGroupsBuildManager().process(
    appletId,
    entityProgressions,
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
