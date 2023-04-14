import { convertProgress } from '@app/abstract/lib';
import { useAppletDetailsQuery } from '@app/entities/applet';
import { selectInProgressApplets } from '@app/entities/applet/model/selectors';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { useEventsQuery } from '@app/entities/event/api';
import { mapEventsFromDto } from '@app/entities/event/model/mappers';
import { AppletDetailsDto } from '@app/shared/api';
import { useAppSelector } from '@app/shared/lib';

import {
  Activity,
  ActivityFlow,
  ActivityListGroup,
  ActivityOrFlow,
  EventEntity,
} from '../../lib';
import { createActivityGroupsBuilder } from '../factories/ActivityGroupsBuilder';
import { mapActivitiesFromDto, mapActivityFlowsFromDto } from '../mappers';

type UseActivityGroupsReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  error?:
    | ReturnType<typeof useAppletDetailsQuery>['error']
    | ReturnType<typeof useEventsQuery>['error'];
  groups: ActivityListGroup[];
};

const buildIdToEntityMap = (
  activities: Activity[],
  activityFlows: ActivityFlow[],
): Record<string, ActivityOrFlow> => {
  return [...activities, ...activityFlows].reduce<
    Record<string, ActivityOrFlow>
  >((acc, current) => {
    acc[current.id] = current;
    return acc;
  }, {});
};

export const useActivityGroups = (
  appletId: string,
): UseActivityGroupsReturn => {
  const {
    isLoading: isLoadingApplets,
    error: errorDueToApplets,
    data: entities,
  } = useAppletDetailsQuery(appletId, {
    select: data => {
      const dto: AppletDetailsDto = data.data.result;
      return {
        activities: mapActivitiesFromDto(dto.activities),
        activityFlows: mapActivityFlowsFromDto(dto.activityFlows),
      };
    },
  });

  const {
    isLoading: isLoadingEvents,
    error: errorDueToEvents,
    data: events,
  } = useEventsQuery(appletId, {
    select: (data): ScheduleEvent[] => {
      return mapEventsFromDto(data.data.result.events);
    },
  });

  const entitiesProgress = useAppSelector(selectInProgressApplets);

  if (isLoadingApplets || isLoadingEvents) {
    return {
      groups: [],
      isSuccess: false,
      isLoading: true,
      error: null,
    };
  }

  if (errorDueToApplets || errorDueToEvents) {
    return {
      groups: [],
      isSuccess: false,
      isLoading: false,
      error: errorDueToApplets ?? errorDueToEvents,
    };
  }

  const { activities, activityFlows } = entities;

  const idToEntity = buildIdToEntityMap(activities, activityFlows);

  const builder = createActivityGroupsBuilder({
    allAppletActivities: activities,
    appletId: appletId,
    progress: convertProgress(entitiesProgress),
  });

  let entityEvents = events.map<EventEntity>(event => ({
    entity: idToEntity[event.entityId],
    event,
  }));

  const calculator = EventModel.ScheduledDateCalculator;

  for (let eventActivity of entityEvents) {
    const date = calculator.calculate(eventActivity.event);
    eventActivity.event.scheduledAt = date;
  }

  entityEvents = entityEvents.filter(x => x.event.scheduledAt);

  const groupAvailable = builder!.buildAvailable(entityEvents);
  const groupInProgress = builder!.buildInProgress(entityEvents);
  const groupScheduled = builder!.buildScheduled(entityEvents);

  return {
    groups: [groupInProgress, groupAvailable, groupScheduled],
    isSuccess: true,
    isLoading: false,
    error: null,
  };
};
