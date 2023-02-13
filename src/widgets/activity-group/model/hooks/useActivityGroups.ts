import { useAppletDetailsQuery } from '@app/entities/applet';

import {
  progress,
  allAppletActivities,
  eventActivities,
} from './mocksForEntities';
import { ActivityListGroup } from '../../lib';
import createActivityGroupsBuilder from '../factories/ActivityGroupsBuilder';

type UseActivityGroupsReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  error?: ReturnType<typeof useAppletDetailsQuery>['error'];
  groups: ActivityListGroup[];
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  const { isLoading, isSuccess, error } = useAppletDetailsQuery(appletId);

  const builder = createActivityGroupsBuilder({
    allAppletActivities,
    appletId: 'apid1',
    progress,
  });

  const groupAvailable = builder.buildAvailable(eventActivities);
  const groupInProgress = builder.buildInProgress(eventActivities);
  const groupScheduled = builder.buildScheduled(eventActivities);

  return {
    groups: [groupAvailable, groupInProgress, groupScheduled],
    isSuccess,
    isLoading,
    error,
  };
};
