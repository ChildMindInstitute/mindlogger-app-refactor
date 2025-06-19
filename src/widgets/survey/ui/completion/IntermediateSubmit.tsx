import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { ActivityFlowStep } from '@app/entities/activity/ui/ActivityFlowStep';
import { YStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { Center } from '@app/shared/ui/Center';
import { Text } from '@app/shared/ui/Text';

const ActivityBox = styled(Center, {
  padding: 25,
  mx: 20,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$grey',
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
    <YStack flex={1} mx={40} jc="center">
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

        <YStack space={10}>
          <Button
            bg="$blue"
            aria-label="submit-button"
            onPress={onPressSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color={isBackDisabled ? '$lightGrey' : '$blue'}
            aria-label="back-button"
            textAlign="center"
            fontSize={17}
            fontWeight="700"
            onPress={onPressBack}
            disabled={isBackDisabled}
          >
            {t('activity_navigation:back')}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
};
