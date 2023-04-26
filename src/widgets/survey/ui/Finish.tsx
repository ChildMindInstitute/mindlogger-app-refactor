import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useActivityAnswersMutation } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { PassSurveyModel } from '@app/features/pass-survey';
import {
  getUnixTimestamp,
  onApiRequestError,
  useAppDispatch,
} from '@app/shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

import { FinishReason, useFlowState } from '../model';
import { mapAnswersToDto } from '../model/mappers';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;

  onClose: () => void;
};

function FinishItem({ flowId, appletId, activityId, eventId, onClose }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
    });

  const { isTimerElapsed } = useFlowState({
    appletId,
    eventId,
    flowId,
  });

  const {
    mutate: sendAnswers,
    isLoading: isSendingAnswers,
    isSuccess: successfullySentAnswers,
    isPaused: isOffline,
  } = useActivityAnswersMutation({
    onError: error => {
      if (error.response.status !== 401 && error.evaluatedMessage) {
        onApiRequestError(error.evaluatedMessage);
      }
    },
  });

  let finishReason: FinishReason = isTimerElapsed ? 'time-is-up' : 'regular';

  const finished =
    isOffline || successfullySentAnswers || finishReason === 'time-is-up';

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

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        {finished && (
          <>
            <Center mb={20}>
              <Text fontSize={24} fontWeight="bold">
                {finishReason === 'regular' && t('additional:thanks')}
                {finishReason === 'time-is-up' && t('additional:time-end')}
              </Text>

              <Text fontSize={16}>{t('additional:saved_answers')}</Text>
            </Center>

            <Button onPress={onClose}>{t('additional:close')}</Button>
          </>
        )}

        {isLoading && <Text fontSize={22}>Please Wait ...</Text>}
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
