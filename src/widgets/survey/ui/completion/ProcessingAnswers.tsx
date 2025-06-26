import { FC, useEffect } from 'react';
import { Image } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useForceUpdate } from '@app/shared/lib/hooks/useForceUpdate';
import { useUploadProgress } from '@app/shared/lib/hooks/useUploadProgress';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';
import { curiousIconAnimated } from '@assets/images';

import { ActivityProgressStep } from './ActivityProgressStep';
import { CircleProgressStep } from './CircleProgressStep';

export const ProcessingAnswers: FC = () => {
  const { t } = useTranslation();

  const {
    isValid,
    currentStep,
    totalSteps,
    currentActivity,
    totalActivities,
    currentActivityName,
    currentSecondLevelStep,
  } = useUploadProgress();

  const update = useForceUpdate();

  useEffect(() => {
    update();
  }, [currentSecondLevelStep, update]);

  return (
    <YStack flex={1} maxWidth={400} jc="center" ai="center" mx="auto">
      {!isValid && (
        <Image
          source={curiousIconAnimated}
          style={{ width: 128, height: 128, marginBottom: 48 }}
        />
      )}

      <Text
        mb={14}
        als="center"
        textAlign="center"
        fontSize={32}
        lineHeight={40}
      >
        {t('autocompletion:processing_answers')}
      </Text>

      <Text
        mb={32}
        als="center"
        textAlign="center"
        fontSize={18}
        lineHeight={28}
      >
        {t('autocompletion:preparing_answers')}
      </Text>

      {isValid && (
        <XStack ai="center" bc="$surface1" br={12} px={16} py={20} gap={12}>
          <Box w={90}>
            <CircleProgressStep
              circleSize={88}
              currentStep={currentStep!}
              totalSteps={totalSteps!}
            />
          </Box>

          <Box flex={1}>
            <ActivityProgressStep
              currentActivity={currentActivity!}
              currentActivityName={currentActivityName!}
              currentSecondLevelStep={currentSecondLevelStep!}
              totalActivities={totalActivities!}
            />
          </Box>
        </XStack>
      )}
    </YStack>
  );
};
