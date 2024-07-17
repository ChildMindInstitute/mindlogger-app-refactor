import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { EntityPathParams, StoreProgress } from '@app/abstract/lib';
import {
  QueueProcessingService,
  useRetryUpload,
} from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { AppletModel } from '@entities/applet';
import {
  Logger,
  UploadObservable,
  useAppDispatch,
  useAppSelector,
} from '@shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

import { useFlowStorageRecord } from '../';
import { FinishReason, useAutoCompletion } from '../model';
import { ConstructCompletionsService } from '../model/services/ConstructCompletionsService';

type Props = {
  appletId: string;
  activityId: string;
  activityName: string;
  eventId: string;
  flowId?: string;
  order: number;
  isTimerElapsed: boolean;
  interruptionStep: number | null;
  onClose: () => void;
};

function FinishItem({
  flowId,
  appletId,
  activityId,
  activityName,
  eventId,
  order,
  isTimerElapsed,
  interruptionStep,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const { flowStorageRecord: flowState } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
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
    Logger.log(
      `[Finish.completeInterruptedActivity] interruptionStep=${interruptionStep}`,
    );

    const {
      order: interruptedOrder,
      activityId: interruptedActivityId,
      activityName: interruptedActivityName,
    } = flowState!.pipeline[interruptionStep!].payload;

    const isInterruptedActivityLast = interruptedOrder === order;

    Logger.log(
      `[Finish.completeInterruptedActivity] Interrupted activityId=${interruptedActivityId}, name=${interruptedActivityName} order=${interruptedOrder}, isLast=${isInterruptedActivityLast}`,
    );

    if (!isInterruptedActivityLast) {
      await constructCompletionService.construct({
        activityId: interruptedActivityId,
        activityName: interruptedActivityName,
        appletId,
        eventId,
        flowId,
        order: interruptedOrder,
        completionType: 'intermediate',
        isAutocompletion: isCompletedAutomatically,
      });
    }
  }

  async function completeActivity() {
    const constructCompletionService = new ConstructCompletionsService(
      null,
      queryClient,
      storeProgress,
      QueueProcessingService,
      dispatch,
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
      order,
      completionType: 'finish',
      isAutocompletion: isCompletedAutomatically,
    });

    const exclude: EntityPathParams = {
      appletId,
      entityId: flowId ?? activityId,
      eventId,
    };

    const success = await processWithAutocompletion(exclude, true);

    if (!success) {
      openRetryAlert();
    } else {
      queryClient.invalidateQueries(['activity_analytics']);
    }
  }

  useEffect(() => {
    UploadObservable.reset();

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
      <ImageBackground>
        <Center flex={1} mx={16}>
          <Text fontSize={22}>{t('activity:please_wait')}...</Text>
        </Center>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        <Center accessibilityLabel="answer_saved-label">
          <Text
            fontSize={24}
            accessibilityLabel="answer_saved-title"
            fontWeight="bold"
          >
            {finishReason === 'regular' && t('additional:thanks')}
            {finishReason === 'time-is-up' && t('additional:time-end')}
          </Text>

          <Text
            fontSize={16}
            mb={20}
            accessibilityLabel="answer_saved-description"
          >
            {t('additional:saved_answers')}
          </Text>
        </Center>

        <Button accessibilityLabel="close-button" onPress={onClose}>
          {t('additional:close')}
        </Button>
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
