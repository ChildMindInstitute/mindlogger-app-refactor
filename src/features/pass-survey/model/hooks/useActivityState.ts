import { useActivityStorageRecord } from '../../lib';

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
        [step]: {
          ...activityStorageRecord.answers?.[step],
          answer,
        },
      },
    });
  }

  function setAdditionalAnswer(step: number, answer: string) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      answers: {
        ...activityStorageRecord.answers,
        [step]: {
          ...activityStorageRecord.answers?.[step],
          additionalAnswer: answer,
        },
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

  function setTimer(timerId: number, progress: number) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,

      timer: {
        timerId,
        progress,
      },
    });
  }

  function removeTimer() {
    if (!activityStorageRecord) {
      return;
    }

    if (activityStorageRecord.timer?.timerId) {
      clearInterval(activityStorageRecord.timer?.timerId);
    }

    delete activityStorageRecord.timer;

    upsertActivityStorageRecord({
      ...activityStorageRecord,
    });
  }

  return {
    activityStorageRecord,
    setStep,
    setAnswer,
    removeAnswer,
    setAdditionalAnswer,
    clearActivityStorageRecord,
    setTimer,
    removeTimer,
  };
}

export default useActivityState;
