import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType, FlowProgressActivity } from '@app/abstract/lib';
import { ActivityModel } from '@app/entities/activity';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';

import { useFlowStorageRecord } from '../../lib';
import { getScheduledDate } from '../operations';
import {
  buildActivityFlowPipeline,
  buildSingleActivityPipeline,
} from '../pipelineBuilder';

type UseActivityRecordCreatorArgs = {
  appletId: string;
  eventId: string;
  entityId: string;
  entityType: EntityType;
};

export function useFlowRecordInitialization({
  appletId,
  eventId,
  entityId,
  entityType,
}: UseActivityRecordCreatorArgs) {
  const { flowStorageRecord, upsertFlowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
  });

  const queryClient = useQueryClient();

  const initializedRef = useRef(!!flowStorageRecord);

  const activityQueryService = useMemo(
    () => new ActivityModel.ActivityQueryService(queryClient),
    [queryClient],
  );

  const step = flowStorageRecord?.step ?? 0;

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response =>
      AppletModel.mapAppletDetailsFromDto(response.data.result),
  });

  const scheduledEvent = EventModel.useScheduledEvent({ appletId, eventId });

  const flow = applet?.activityFlows.find(x => x.id === entityId);

  const buildPipeline = useCallback(() => {
    if (!applet) {
      return [];
    }

    const hasSummary = (activityId: string) => {
      return activityQueryService.getActivityDetails(activityId).hasSummary;
    };

    const isActivityFlow = entityType === 'flow';

    if (!isActivityFlow) {
      const activity = applet.activities.find(x => x.id === entityId)!;

      return buildSingleActivityPipeline({
        appletId,
        eventId,
        activity: {
          id: activity.id,
          name: activity.name,
          description: activity.description,
          image: activity.image,
        },
        hasSummary,
      });
    } else {
      const activityIds = flow!.activityIds;

      const activities = applet.activities
        .filter(x => activityIds.includes(x.id))
        .map<FlowProgressActivity>(x => ({
          id: x.id,
          name: x.name,
          description: x.description,
          image: x.image,
        }));

      return buildActivityFlowPipeline({
        activities,
        appletId,
        eventId,
        flowId: entityId,
        startFrom: step,
        hasSummary,
      });
    }
  }, [
    applet,
    appletId,
    eventId,
    step,
    entityId,
    entityType,
    activityQueryService,
    flow,
  ]);

  const canCreateStorageRecord =
    !initializedRef.current && applet && !flowStorageRecord;

  const createStorageRecord = useCallback(() => {
    const scheduledDate = getScheduledDate(scheduledEvent!);

    return upsertFlowStorageRecord({
      step: 0,
      pipeline: buildPipeline(),
      isCompletedDueToTimer: false,
      context: {},
      flowName: flow?.name ?? null,
      scheduledDate: scheduledDate ?? null,
    });
  }, [buildPipeline, upsertFlowStorageRecord, flow, scheduledEvent]);

  useEffect(() => {
    if (canCreateStorageRecord) {
      createStorageRecord();
      initializedRef.current = true;
    }
  }, [canCreateStorageRecord, createStorageRecord]);
}
