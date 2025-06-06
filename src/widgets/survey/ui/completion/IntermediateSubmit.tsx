import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { XStack, YStack } from '@app/shared/ui/base';
import { Image } from 'react-native';
import { Button } from '@app/shared/ui/Button';
import { Center } from '@app/shared/ui/Center';
import { Text } from '@app/shared/ui/Text';
import { badge } from '@assets/images';

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
    <YStack flex={1} mx={40} jc="center" bg="$white">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="bold">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text
            accessibilityLabel="next_activity-name"
            fontWeight="bold"
            mb={10}
            fontSize={16}
          >
            {activityName}
          </Text>

          <XStack>
            <Image
              source={badge}
              width={18}
              height={18}
              style={{
                opacity: 0.6,
                right: 4,
              }}
            />

            <Text fontSize={14} color="$grey">
              {activitiesPassed + 1} of {totalActivities} {flowName}
            </Text>
          </XStack>
        </ActivityBox>

        <YStack space={10}>
          <Button
            bg="$blue"
            accessibilityLabel="submit-button"
            onPress={onPressSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color={isBackDisabled ? '$lightGrey' : '$blue'}
            accessibilityLabel="back-button"
            textAlign="center"
            fontSize={17}
            fontWeight="bold"
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
