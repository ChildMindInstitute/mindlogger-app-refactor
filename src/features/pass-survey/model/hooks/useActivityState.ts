import { useMemo } from 'react';

import { ActivityDto } from '@app/shared/api';
import { ActivityModel, useActivityDetailsQuery } from '@entities/activity';

import { useActivityStorageRecord } from '../../lib';
import { buildPipeline } from '../pipelineBuilder';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

const mockActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ordering: 0,
  items: [
    {
      id: 100,
      inputType: 'DrawingTest',
      config: {
        instruction: 'Test instruction',
        imageUrl: null,
        backgroundImageUrl: null,
      },
      timer: 0,
      hasTokenValue: true,
      isSkippable: true,
      hasAlert: true,
      hasScore: true,
      isAbleToMoveToPrevious: true,
      hasTextResponse: true,
      order: 0,
    },
  ],
};

function useActivityState({
  appletId,
  activityId,
  eventId,
}: UseActivityPipelineArgs) {
  const { activityStorageRecord, upsertActivityStorageRecord } =
    useActivityStorageRecord({
      appletId,
      activityId,
      eventId,
    });

  let { data: activity } = useActivityDetailsQuery(activityId, {
    enabled: !activityStorageRecord,
    select: r => r.data.result,
  });

  // @todo remove once integration is done
  if (!activity) {
    activity = mockActivity;
  }

  const pipeline = useMemo(
    () =>
      activity ? buildPipeline(ActivityModel.mapToActivity(activity)) : [],
    [activity],
  );

  const shouldCreateStorage = !activityStorageRecord && pipeline.length;

  if (shouldCreateStorage) {
    createActivityStorage();
  }

  function createActivityStorage() {
    upsertActivityStorageRecord({
      step: 0,
      items: pipeline,
      answers: {},
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

  return { activityStorageRecord, setStep, setAnswer, removeAnswer };
}

export default useActivityState;
