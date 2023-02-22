import { useMemo } from 'react';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';

import {
  progress as progressMocks,
  allAppletActivities as allActivityMocks,
  eventActivities as eventActivityMocks,
} from './mocksForEntities';
import { ActivityListGroup } from '../../lib';
import { createActivityGroupsBuilder } from '../factories/ActivityGroupsBuilder';

type UseActivityGroupsReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  error?: ReturnType<typeof useAppletDetailsQuery>['error'];
  groups: ActivityListGroup[];
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  const {} = useAppletDetailsQuery(appletId, {
    select: data => data.data.result,
  });

  // const allAppletActivities = useMemo(() => {
  //   if (!appletDetails) {
  //     return [];
  //   }

  //   const { activities } = appletDetails;

  //   return activities.map(mapActivityFromDto);
  // }, [appletDetails]);

  const builder = useMemo(
    () =>
      createActivityGroupsBuilder({
        allAppletActivities: allActivityMocks,
        appletId: 'apid1',
        progress: progressMocks,
      }),
    [],
  );

  const calculator = EventModel.SheduledDateCalculator;

  let eventActivities = eventActivityMocks;

  for (let eventActivity of eventActivities) {
    const date = calculator.calculate(eventActivity.event);
    eventActivity.event.scheduledAt = date;
  }

  eventActivities = eventActivities.filter(x => x.event.scheduledAt);

  const groupAvailable = builder.buildAvailable(eventActivities);
  const groupInProgress = builder.buildInProgress(eventActivities);
  const groupScheduled = builder.buildScheduled(eventActivities);

  return {
    groups: [groupAvailable, groupInProgress, groupScheduled],
    isSuccess: true,
    isLoading: false,
    error: null,
  };
};
