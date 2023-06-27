import { useCallback, useEffect, useRef } from 'react';

import { EntityType } from '@app/abstract/lib';
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

  const initializedRef = useRef(!!flowStorageRecord);

  const step = flowStorageRecord?.step ?? 0;

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response =>
      AppletModel.mapAppletDetailsFromDto(response.data.result),
  });

  const buildPipeline = useCallback(() => {
    if (!applet) {
      return [];
    }

    const isActivityFlow = entityType === 'flow';

    if (!isActivityFlow) {
      return buildSingleActivityPipeline({
        appletId,
        eventId,
        activityId: entityId,
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
      });
    }
  }, [applet, appletId, eventId, step, entityId, entityType]);

  const canCreateStorageRecord =
    !initializedRef.current && applet && !flowStorageRecord;

  const createActivityRecord = useCallback(() => {
    return upsertFlowStorageRecord({
      step: 0,
      pipeline: buildPipeline(),
    });
  }, [buildPipeline, upsertFlowStorageRecord]);

  useEffect(() => {
    if (canCreateStorageRecord) {
      createActivityRecord();
      initializedRef.current = true;
    }
  }, [canCreateStorageRecord, createActivityRecord]);
}
