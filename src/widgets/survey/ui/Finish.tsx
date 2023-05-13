import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { useActivityAnswersMutation } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { PassSurveyModel } from '@app/features/pass-survey';
import { LogTrigger } from '@app/shared/api';
import {
  getUnixTimestamp,
  onApiRequestError,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

import { FinishReason } from '../model';
import { mapAnswersToDto } from '../model/mappers';

type Props = {
  appletId: string;
  activityId: string;
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

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
      order,
    });

  const {
    mutate: sendAnswers,
    isLoading: isSendingAnswers,
    isSuccess: successfullySentAnswers,
    isError: sentAnswersWithError,
    isPaused: isOffline,
  } = useActivityAnswersMutation({
    onError: error => {
      if (error.response.status !== 401 && error.evaluatedMessage) {
        onApiRequestError(error.evaluatedMessage);
      }
    },
  });

  let finishReason: FinishReason = isTimerElapsed ? 'time-is-up' : 'regular';

  const finishedSuccessfully =
    isOffline || successfullySentAnswers || finishReason === 'time-is-up';

  const finishedWithSendingError = !isOffline && sentAnswersWithError;

  const isLoading = !isOffline && isSendingAnswers;

  function completeActivity() {
    dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId: flowId ? flowId : activityId,
      }),
    );

    if (!activityStorageRecord) {
      return;
    }

    sendAnswers({
      flowId: flowId ? flowId : null,
      appletId,
      activityId,
      createdAt: getUnixTimestamp(Date.now()),
      version: activityStorageRecord.appletVersion,
      answers: mapAnswersToDto(
        activityStorageRecord.items,
        activityStorageRecord.answers,
      ),
    });

    clearActivityStorageRecord();
  }

  useEffect(() => {
    completeActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseEntity = () => {
    NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      LogTrigger.EntityCompleted,
    );
    onClose();
  };

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        {finishedSuccessfully && (
          <>
            <Center mb={20}>
              <Text fontSize={24} fontWeight="bold">
                {finishReason === 'regular' && t('additional:thanks')}
                {finishReason === 'time-is-up' && t('additional:time-end')}
              </Text>

              <Text fontSize={16}>{t('additional:saved_answers')}</Text>
            </Center>

            <Button onPress={onCloseEntity}>{t('additional:close')}</Button>
          </>
        )}

        {!finishedSuccessfully && finishedWithSendingError && (
          <>
            <Center mb={20}>
              <Text fontSize={24} fontWeight="bold">
                {finishReason === 'regular' && t('additional:sorry')}
              </Text>

              <Text fontSize={16}>{t('additional:server-error')}</Text>
            </Center>

            <Button onPress={onCloseEntity}>{t('additional:close')}</Button>
          </>
        )}

        {isLoading && <Text fontSize={22}>Please Wait ...</Text>}
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
