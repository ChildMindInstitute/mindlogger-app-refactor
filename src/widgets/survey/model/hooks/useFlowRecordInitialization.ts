import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType } from '@app/abstract/lib';
import { ActivityModel } from '@app/entities/activity';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';

import { useFlowStorageRecord } from '../../lib';
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

  const buildPipeline = useCallback(() => {
    if (!applet) {
      return [];
    }

    const hasSummary = (activityId: string) => {
      return activityQueryService.getActivityDetails(activityId).hasSummary;
    };

    const isActivityFlow = entityType === 'flow';

    if (!isActivityFlow) {
      return buildSingleActivityPipeline({
        appletId,
        eventId,
        activityId: entityId,
        hasSummary,
      });
    } else {
      const activityIds = applet.activityFlows.find(
        flow => flow.id === entityId,
      )?.activityIds;

      return buildActivityFlowPipeline({
        activityIds: activityIds!,
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
  ]);

  const canCreateStorageRecord =
    !initializedRef.current && applet && !flowStorageRecord;

  const createStorageRecord = useCallback(() => {
    return upsertFlowStorageRecord({
      step: 0,
      pipeline: buildPipeline(),
      isCompletedDueToTimer: false,
      context: {},
    });
  }, [buildPipeline, upsertFlowStorageRecord]);

  useEffect(() => {
    if (canCreateStorageRecord) {
      createStorageRecord();
      initializedRef.current = true;
    }
  }, [canCreateStorageRecord, createStorageRecord]);
}
