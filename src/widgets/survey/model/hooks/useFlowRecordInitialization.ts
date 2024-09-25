import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType } from '@app/abstract/lib/types/entity';
import { ActivityQueryService } from '@app/entities/activity/model/services/ActivityQueryService';
import { useAppletDetailsQuery } from '@app/entities/applet/api/hooks/useAppletDetailsQuery';
import { mapAppletDetailsFromDto } from '@app/entities/applet/model/mappers';
import { useScheduledEvent } from '@app/entities/event/model/hooks/useEvent';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { useFlowStorageRecord } from '../../lib/useFlowStorageRecord';
import { getScheduledDate } from '../operations';
import {
  buildActivityFlowPipeline,
  buildSingleActivityPipeline,
} from '../pipelineBuilder';

type UseFlowRecordCreatorArgs = {
  appletId: string;
  eventId: string;
  entityId: string;
  entityType: EntityType;
  targetSubjectId: string | null;
};

export function useFlowRecordInitialization({
  appletId,
  eventId,
  entityId,
  entityType,
  targetSubjectId,
}: UseFlowRecordCreatorArgs) {
  const { flowStorageRecord, upsertFlowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
    targetSubjectId,
  });

  const queryClient = useQueryClient();

  const initializedRef = useRef(!!flowStorageRecord);

  const activityQueryService = useMemo(
    () => new ActivityQueryService(queryClient),
    [queryClient],
  );

  const step = flowStorageRecord?.step ?? 0;

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response => mapAppletDetailsFromDto(response.data.result),
  });

  const scheduledEvent = useScheduledEvent({ appletId, eventId });

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
        targetSubjectId,
        activity: {
          id: activity.id,
          name: activity.name,
          description: activity.description,
          image: activity.image,
        },
        hasSummary,
      });
    } else {
      const activities = flow!.activityIds.map(id => {
        const found = applet.activities.find(x => x.id === id)!;
        return {
          id: found.id,
          name: found.name,
          description: found.description,
          image: found.image,
        };
      });

      return buildActivityFlowPipeline({
        activities,
        appletId,
        eventId,
        flowId: entityId,
        targetSubjectId,
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
    targetSubjectId,
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
      interruptionStep: null,
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

  const logFlowStepItem = flowStorageRecord?.pipeline[flowStorageRecord?.step];
  const logIsFlowStorageRecordExist = !!flowStorageRecord;

  useEffect(() => {
    if (!logIsFlowStorageRecordExist) {
      getDefaultLogger().log(
        "[useFlowRecordInitialization]: flowStorageRecord doesn't exist",
      );
    } else {
      getDefaultLogger().log(
        `[useFlowRecordInitialization]: flowStorageRecord's step changed: step = ${step}`,
      );
      getDefaultLogger().log(
        `[useFlowRecordInitialization]: flowStorageRecord current item: ${JSON.stringify(
          logFlowStepItem,
          null,
          2,
        )}`,
      );
    }
  }, [logIsFlowStorageRecordExist, step, logFlowStepItem]);
}
