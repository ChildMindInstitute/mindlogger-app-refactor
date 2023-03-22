import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { useActivityAnswersMutation } from '@app/entities/activity';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';
import { PassSurveyModel } from '@app/features/pass-survey';
import { useAppDispatch } from '@app/shared/lib';
import { badge } from '@assets/images';
import { Center, YStack, Text, Button, Image, XStack } from '@shared/ui';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId: string;

  onClose: () => void;
  onFinish: () => void;
};

const mockActivityFlow = {
  id: 'afid1',
  name: 'Activity Flow number 1',
  description:
    'Activity Flow description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  hideBadge: false,
  ordering: 0,
  isSingleReport: false,
  activityIds: ['aid2', 'aid1'],
};

const ActivityBox = styled(Center, {
  padding: 25,
  mx: 20,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$grey',
});

function IntermediateItem({
  flowId,
  appletId,
  activityId,
  eventId,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  let { data: activityFlow } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result.activityFlows.find(o => o.id === flowId),
  });

  if (!activityFlow) {
    activityFlow = mockActivityFlow;
  }

  const totalActivities = activityFlow.activityIds.length;
  const passedActivities =
    activityFlow.activityIds.findIndex(id => id === activityId) + 1;

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
    });

  const { mutate: sendAnswers, isLoading: isSendingAnswers } =
    useActivityAnswersMutation({
      onSuccess: () => {
        clearActivityStorageRecord();
        changeActivity();
        onFinish();
      },
    });

  function changeActivity() {
    if (!activityFlow) {
      return;
    }

    const nextActivityId = activityFlow.activityIds[passedActivities];

    dispatch(
      AppletModel.actions.flowUpdated({
        appletId,
        flowId,
        activityId: nextActivityId,
        eventId,
      }),
    );
  }

  function completeActivity() {
    if (!activityStorageRecord) {
      return;
    }

    sendAnswers({
      flowId,
      appletId,
      activityId,
      version: activityStorageRecord.appletVersion,
      answers: activityStorageRecord.answers as any,
    });
  }

  return (
    <YStack flex={1} mx={40} jc="center" bg="$white">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="bold">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text fontWeight="bold" mb={10} fontSize={16}>
            Activity 3
          </Text>

          <XStack>
            <Image src={badge} width={18} height={18} opacity={0.6} r={4} />

            <Text fontSize={14} color="$grey">
              {passedActivities} of {totalActivities} {activityFlow.name}
            </Text>
          </XStack>
        </ActivityBox>

        <YStack space={10}>
          <Button
            bg="$blue"
            onPress={completeActivity}
            isLoading={isSendingAnswers}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color="$blue"
            textAlign="center"
            fontSize={17}
            fontWeight="bold"
            onPress={onClose}
          >
            {t('activity_navigation:back')}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

export default IntermediateItem;
