import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { EntityPathParams, StoreProgress } from '@app/abstract/lib';
import {
  QueueProcessingService,
  useRetryUpload,
} from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { AppletModel } from '@entities/applet';
import { UploadObservable, useAppDispatch, useAppSelector } from '@shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

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
  onClose,
}: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

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

  let finishReason: FinishReason = isTimerElapsed ? 'time-is-up' : 'regular';

  async function completeActivity() {
    const constructCompletionService = new ConstructCompletionsService(
      null,
      queryClient,
      storeProgress,
      QueueProcessingService,
      dispatch,
    );

    await constructCompletionService.construct({
      activityId,
      activityName,
      appletId,
      eventId,
      flowId,
      order,
      completionType: 'finish',
      submitId: uuidv4(),
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
