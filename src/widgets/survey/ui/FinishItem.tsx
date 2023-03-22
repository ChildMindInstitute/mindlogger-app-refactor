import { useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { useActivityAnswersMutation } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { PassSurveyModel } from '@app/features/pass-survey';
import { useAppDispatch } from '@app/shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;

  onClose: () => void;
};

function FinishItem({ flowId, appletId, activityId, eventId, onClose }: Props) {
  const shouldSendAnswers = useRef(true);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
    });

  const {
    mutate: sendAnswers,
    isLoading: isSendingAnswers,
    isSuccess: successfullySentAnswers,
  } = useActivityAnswersMutation({
    onSuccess: () => {
      cleanup();
    },
  });

  function completeActivity() {
    if (!activityStorageRecord) {
      return;
    }

    dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId: flowId ? flowId : activityId,
      }),
    );

    sendAnswers({
      flowId,
      appletId,
      activityId,
      version: activityStorageRecord.appletVersion,
      answers: activityStorageRecord.answers as any,
    });
  }

  function cleanup() {
    dispatch(
      AppletModel.actions.entityAnswersSent({
        appletId,
        eventId,
        entityId: flowId ? flowId : activityId,
      }),
    );

    clearActivityStorageRecord();
  }

  if (shouldSendAnswers.current) {
    shouldSendAnswers.current = false;

    setImmediate(completeActivity);
  }

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        {successfullySentAnswers && (
          <>
            <Center mb={20}>
              <Text fontSize={24} fontWeight="bold">
                {t('additional:thanks')}
              </Text>

              <Text fontSize={16}>{t('additional:saved_answers')}</Text>
            </Center>

            <Button onPress={onClose}>{t('additional:close')}</Button>
          </>
        )}

        {isSendingAnswers && <Text fontSize={22}>Please Wait ...</Text>}
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
