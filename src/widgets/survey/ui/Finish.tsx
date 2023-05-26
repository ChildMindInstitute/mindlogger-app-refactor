import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { useActivityAnswersMutation } from '@entities/activity';
import { AppletModel, useAppletDetailsQuery } from '@entities/applet';
import { NotificationModel } from '@entities/notification';
import { PassSurveyModel } from '@features/pass-survey';
import { LogTrigger } from '@shared/api';
import {
  getUnixTimestamp,
  onApiRequestError,
  useAppDispatch,
  useAppSelector,
} from '@shared/lib';
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

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response =>
      AppletModel.mapAppletDetailsFromDto(response.data.result),
  });

  const appletEncryption = applet?.encryption || null;

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

  const isLoading = !isOffline && isSendingAnswers;

  function completeActivity() {
    dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId: flowId ? flowId : activityId,
      }),
    );

    if (!appletEncryption) {
      throw new Error('Encryption params is undefined');
    }

    if (!activityStorageRecord) {
      return;
    }

    const hasAnswers = !!Object.keys(activityStorageRecord.answers).length;

    if (hasAnswers) {
      // if not checked, getting http 500

      const answers = mapAnswersToDto(
        activityStorageRecord.items,
        activityStorageRecord.answers,
      );

      const itemIds = Object.entries(activityStorageRecord.answers).map(
        ([step]) => {
          return activityStorageRecord.items[Number(step)]?.id!;
        },
      );

      sendAnswers({
        appletId,
        createdAt: getUnixTimestamp(Date.now()),
        version: activityStorageRecord.appletVersion,
        answers: answers,
        itemIds,
        appletEncryption,
        flowId: flowId ?? null,
        activityId: activityId,
      });
    }

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
        {!isLoading && (
          <>
            <Center mb={20}>
              <Text fontSize={24} fontWeight="bold">
                {finishReason === 'regular' &&
                  !sentAnswersWithError &&
                  t('additional:thanks')}

                {finishReason === 'regular' &&
                  sentAnswersWithError &&
                  t('additional:sorry')}

                {finishReason === 'time-is-up' && t('additional:time-end')}
              </Text>

              {!sentAnswersWithError && (
                <Text fontSize={16}>{t('additional:saved_answers')}</Text>
              )}

              {sentAnswersWithError && (
                <Text fontSize={16}>{t('additional:server-error')}</Text>
              )}
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
