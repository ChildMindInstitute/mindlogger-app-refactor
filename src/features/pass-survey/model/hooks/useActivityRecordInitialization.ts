import { useCallback, useEffect, useMemo } from 'react';

import { useActivityDetailsQuery, ActivityModel } from '@app/entities/activity';
import { useAppletDetailsQuery } from '@app/entities/applet';

import { useActivityStorageRecord } from '../../lib';
import { buildPipeline } from '../pipelineBuilder';

type UseActivityRecordCreatorArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

function useActivityRecordCreator({
  appletId,
  activityId,
  eventId,
}: UseActivityRecordCreatorArgs) {
  const { activityStorageRecord, upsertActivityStorageRecord } =
    useActivityStorageRecord({
      appletId,
      activityId,
      eventId,
    });

  const { data: appletVersion = '' } = useAppletDetailsQuery(appletId, {
    enabled: !activityStorageRecord,
    select: r => r.data.result.version,
  });

  let { data: activity } = useActivityDetailsQuery(activityId, {
    enabled: !activityStorageRecord,
    select: response => {
      console.log(response.data.result.items);
      return ActivityModel.mapToActivity(response.data.result);
    },
  });

  // @todo remove once integration is done
  // activity = TextActivity;

  const pipeline = useMemo(
    () => (activity ? buildPipeline(activity) : []),
    [activity],
  );

  const canCreateStorageRecord =
    !activityStorageRecord && pipeline.length && appletVersion;

  const createActivityRecord = useCallback(() => {
    return upsertActivityStorageRecord({
      step: 0,
      items: pipeline,
      answers: {},
      appletVersion,
      timers: {},
    });
  }, [appletVersion, pipeline, upsertActivityStorageRecord]);

  useEffect(() => {
    if (canCreateStorageRecord) {
      createActivityRecord();
    }
  }, [canCreateStorageRecord, createActivityRecord]);
}

export default useActivityRecordCreator;
