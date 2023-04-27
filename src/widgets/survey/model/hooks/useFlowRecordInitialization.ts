import { useCallback, useEffect, useRef } from 'react';

import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';

import { useFlowStorageRecord } from '../../lib';
import {
  buildActivityFlowPipeline,
  buildSingleActivityPipeline,
} from '../pipelineBuilder';

type UseActivityRecordCreatorArgs = {
  appletId: string;
  eventId: string;
  activityId: string;
  flowId?: string;
};

export function useFlowRecordInitialization({
  appletId,
  eventId,
  activityId,
  flowId,
}: UseActivityRecordCreatorArgs) {
  const { flowStorageRecord, upsertFlowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
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

    const isActivityFlow = !!flowId;

    if (!isActivityFlow) {
      return buildSingleActivityPipeline({ appletId, eventId, activityId });
    } else {
      const activityIds = applet.activityFlows.find(
        flow => flow.id === flowId,
      )?.activityIds;

      return buildActivityFlowPipeline({
        activityIds: activityIds!,
        appletId,
        eventId,
        flowId,
        startFrom: step,
      });
    }
  }, [activityId, applet, appletId, eventId, flowId, step]);

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
