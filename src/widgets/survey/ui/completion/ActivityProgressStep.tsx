import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

type Props = {
  currentActivity: number;
  totalActivities: number;
  currentActivityName: string;
  currentSecondLevelStep: string;
};

export const ActivityProgressStep = ({
  currentActivity,
  totalActivities,
  currentActivityName,
  currentSecondLevelStep,
}: Props) => {
  const { t } = useTranslation();

  return (
    <YStack gap={8}>
      <Text
        fontSize={14}
        fontWeight="700"
        lineHeight={20}
        letterSpacing={0.1}
        color={palette.on_surface}
      >
        {t('activity:activityCounter', {
          currentStep: currentActivity + 1,
          totalSteps: totalActivities,
        })}
      </Text>
      <Text
        fontSize={16}
        fontWeight="700"
        lineHeight={24}
        letterSpacing={0.15}
        numberOfLines={1}
        color={palette.on_surface}
      >
        {currentActivityName}
      </Text>
      <Text
        fontSize={14}
        lineHeight={20}
        letterSpacing={0.5}
        color={palette.on_surface}
      >
        {currentSecondLevelStep}
      </Text>
    </YStack>
  );
};
