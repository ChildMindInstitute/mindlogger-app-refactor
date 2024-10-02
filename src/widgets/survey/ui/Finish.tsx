import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityPathParams } from '@app/abstract/lib/types/entity';
import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultQueueProcessingService } from '@app/entities/activity/lib/services/queueProcessingServiceInstance';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { getDefaultAlertsExtractor } from '@app/features/pass-survey/model/alertsExtractorInstance';
import { getDefaultScoresExtractor } from '@app/features/pass-survey/model/scoresExtractorInstance';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { ReduxPersistor } from '@app/shared/lib/redux-state/store';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ImageBackground } from '@app/shared/ui/ImageBackground';
import { FinishReason } from '@widgets/survey/model/IPipelineBuilder.ts';

import { AnswersSubmitted } from './completion/AnswersSubmitted';
import { SubScreenContainer } from './completion/containers';
import { ProcessingAnswers } from './completion/ProcessingAnswers';
import { useFlowStorageRecord } from '../lib/useFlowStorageRecord';
import { useAutoCompletion } from '../model/hooks/useAutoCompletion';
import { ConstructCompletionsService } from '../model/services/ConstructCompletionsService';

type Props = {
  appletId: string;
  activityId: string;
  activityName: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
  order: number;
  isTimerElapsed: boolean;
  interruptionStep: number | null;
  onClose: () => void;
};

export function FinishItem({
  flowId,
  appletId,
  activityId,
  activityName,
  eventId,
  targetSubjectId,
  order,
  isTimerElapsed,
  interruptionStep,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  const { flowStorageRecord: flowState } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const {
    isCompleted,
    isPostponed,
    isError,
    process: processQueue,
  } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpened, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
    });

  const { process: processWithAutocompletion } = useAutoCompletion();

  const finishReason: FinishReason = isTimerElapsed ? 'time-is-up' : 'regular';

  const isCompletedAutomatically = finishReason === 'time-is-up';

  const isFlow = !!flowId;

  async function completeInterruptedActivity(
    constructCompletionService: ConstructCompletionsService,
  ) {
    getDefaultLogger().log(
      `[Finish.completeInterruptedActivity] interruptionStep=${interruptionStep}`,
    );

    const {
      order: interruptedOrder,
      activityId: interruptedActivityId,
      activityName: interruptedActivityName,
    } = flowState!.pipeline[interruptionStep!].payload;

    const isInterruptedActivityLast = interruptedOrder === order;

    getDefaultLogger().log(
      `[Finish.completeInterruptedActivity] Interrupted activityId=${interruptedActivityId}, name=${interruptedActivityName} order=${interruptedOrder}, isLast=${isInterruptedActivityLast}`,
    );

    if (!isInterruptedActivityLast) {
      await constructCompletionService.construct({
        activityId: interruptedActivityId,
        activityName: interruptedActivityName,
        appletId,
        eventId,
        flowId,
        targetSubjectId,
        order: interruptedOrder,
        completionType: 'intermediate',
        isAutocompletion: isCompletedAutomatically,
      });
    }
  }

  async function completeActivity() {
    const constructCompletionService = new ConstructCompletionsService(
      null,
      getDefaultLogger(),
      queryClient,
      getDefaultQueueProcessingService(),
      getDefaultAlertsExtractor(),
      getDefaultScoresExtractor(),
      dispatch,
      ReduxPersistor,
      entityProgressions,
    );

    if (isCompletedAutomatically && isFlow) {
      await completeInterruptedActivity(constructCompletionService);
    }

    await constructCompletionService.construct({
      activityId,
      activityName,
      appletId,
      eventId,
      flowId,
      targetSubjectId,
      order,
      completionType: 'finish',
      isAutocompletion: isCompletedAutomatically,
    });

    const exclude: EntityPathParams = {
      appletId,
      entityId: flowId ?? activityId,
      eventId,
      targetSubjectId,
    };

    const success = await processWithAutocompletion(exclude, true);

    if (!success) {
      openRetryAlert();
    } else {
      queryClient.invalidateQueries(['activity_analytics']);
    }
  }

  useEffect(() => {
    getDefaultUploadObservable().reset();

    setTimeout(() => {
      completeActivity();
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRetryAlertOpened) {
    return <ImageBackground />;
  }

  if (!isCompleted && !isPostponed && !isError) {
    return (
      <SubScreenContainer>
        <ProcessingAnswers />
      </SubScreenContainer>
    );
  }

  return (
    <SubScreenContainer>
      <AnswersSubmitted onPressDone={onClose} />
    </SubScreenContainer>
  );
}
