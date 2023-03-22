import { useMemo } from 'react';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { ActivityModel, useActivityDetailsQuery } from '@entities/activity';

import { DrawingTestActivity } from './mockActivities';
import { useActivityStorageRecord } from '../../lib';
import { buildPipeline } from '../pipelineBuilder';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

function useActivityState({
  appletId,
  activityId,
  eventId,
}: UseActivityPipelineArgs) {
  const {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorageRecord,
  } = useActivityStorageRecord({
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
    select: r => r.data.result,
  });

  // @todo remove once integration is done
  if (!activity) {
    activity = DrawingTestActivity.grid;
  }

  const pipeline = useMemo(
    () =>
      activity ? buildPipeline(ActivityModel.mapToActivity(activity)) : [],
    [activity],
  );

  const shouldCreateStorage =
    !activityStorageRecord && pipeline.length && appletVersion;

  if (shouldCreateStorage) {
    createActivityStorage();
  }

  function createActivityStorage() {
    upsertActivityStorageRecord({
      step: 0,
      items: pipeline,
      answers: {},
      appletVersion,
    });
  }

  function setStep(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      step,
    });
  }

  function setAnswer(step: number, answer: any) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      answers: {
        ...activityStorageRecord.answers,
        [step]: answer,
      },
    });
  }

  function removeAnswer(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    const answers = { ...activityStorageRecord.answers };

    delete answers[step];

    if (activityStorageRecord) {
      upsertActivityStorageRecord({
        ...activityStorageRecord,
        answers,
      });
    }
  }

  return {
    activityStorageRecord,
    setStep,
    setAnswer,
    removeAnswer,
    clearActivityStorageRecord,
  };
}

export default useActivityState;
