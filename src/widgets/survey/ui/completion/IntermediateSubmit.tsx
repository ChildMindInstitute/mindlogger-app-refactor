import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { ActivityFlowStep } from '@app/entities/activity/ui/ActivityFlowStep';
import { YStack } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

const ActivityBox = styled(Center, {
  padding: 24,
  borderRadius: 16,
  bg: '$surface1',
});

type Props = {
  activityName: string;
  activitiesPassed: number;
  totalActivities: number;
  flowName: string;
  isLoading: boolean;
  isBackDisabled: boolean;
  onPressBack: () => void;
  onPressSubmit: () => void;
};

export const IntermediateSubmit: FC<Props> = ({
  activityName,
  activitiesPassed,
  totalActivities,
  flowName,
  onPressSubmit,
  isLoading,
  isBackDisabled,
  onPressBack,
}) => {
  const { t } = useTranslation();

  return (
    <YStack flex={1} maxWidth={400} jc="center" mx="auto">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="700">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text
            aria-label="next_activity-name"
            fontWeight="700"
            mb={10}
            fontSize={16}
          >
            {activityName}
          </Text>

          <ActivityFlowStep
            activityPositionInFlow={activitiesPassed + 1}
            numberOfActivitiesInFlow={totalActivities}
            activityFlowName={flowName}
          />
        </ActivityBox>

        <YStack gap={16}>
          <SubmitButton
            aria-label="submit-button"
            onPress={onPressSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t('change_study:submit')}
          </SubmitButton>

          <SubmitButton
            mode="secondary"
            aria-label="back-button"
            onPress={onPressBack}
            disabled={isBackDisabled}
          >
            {t('activity_navigation:back')}
          </SubmitButton>
        </YStack>
      </YStack>
    </YStack>
  );
};
