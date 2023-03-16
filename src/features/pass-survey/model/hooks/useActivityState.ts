import { useMemo } from 'react';

import { ActivityDto } from '@app/shared/api';
import { ActivityModel, useActivityDetailsQuery } from '@entities/activity';

import { useActivityStorage } from '../../lib';
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
      inputType: 'AbTest',
      config: {
        device: 'Phone',
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
  const { activityStorage, changeActivityStorage } = useActivityStorage({
    appletId,
    activityId,
    eventId,
  });

  let { data: activity } = useActivityDetailsQuery(activityId, {
    enabled: !activityStorage,
    select: r => r.data.result,
  });

  if (!activity) {
    activity = mockActivity;
  }

  const pipeline = useMemo(
    () =>
      activity ? buildPipeline(ActivityModel.mapToActivity(activity)) : [],
    [activity],
  );

  if (!activityStorage && pipeline.length) {
    changeActivityStorage({
      step: 0,
      items: pipeline,
      answers: {},
    });
  }

  function setStep(step: number) {
    if (!activityStorage) {
      return;
    }

    changeActivityStorage({
      ...activityStorage,
      step,
    });
  }

  function setAnswer(step: number, answer: any) {
    if (!activityStorage) {
      return;
    }

    changeActivityStorage({
      ...activityStorage,
      answers: {
        ...activityStorage.answers,
        [step]: answer,
      },
    });
  }

  function removeAnswer(step: number) {
    if (!activityStorage) {
      return;
    }

    const answers = { ...activityStorage.answers };

    delete answers[step];

    if (activityStorage) {
      changeActivityStorage({
        ...activityStorage,
        answers,
      });
    }
  }

  return { activityState: activityStorage, setStep, setAnswer, removeAnswer };
}

export default useActivityState;
