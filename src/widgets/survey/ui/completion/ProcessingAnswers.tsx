import { FC, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { colors, useForceUpdate, useUploadProgress } from '@app/shared/lib';
import { ActivityIndicator, Box, Text, YStack } from '@shared/ui';

import ActivityProgressStep from './ActivityProgressStep';
import CircleProgressStep from './CircleProgressStep';

const ProcessingAnswers: FC = () => {
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
    <Box flex={1} justifyContent="center">
      <YStack>
        {!isValid && (
          <ActivityIndicator mb={24} size={'large'} color={colors.blue} />
        )}

        <Text mb={24} als="center" fos={31} fow="600">
          {t('autocompletion:processing_answers')}
        </Text>

        <Text mb={16} als="center" ta="center" fos={18}>
          {t('autocompletion:preparing_answers')}
        </Text>

        {isValid && (
          <Box bc={colors.white} br={10} minWidth={349} als={'center'}>
            <Box
              h={107}
              jc="center"
              fd="row"
              ai="center"
              br={10}
              bc={colors.lightGrey3}
            >
              <Box w={90} mx={8}>
                <CircleProgressStep
                  circleSize={76}
                  currentStep={currentStep!}
                  totalSteps={totalSteps!}
                />
              </Box>

              <Box f={1}>
                <ActivityProgressStep
                  currentActivity={currentActivity!}
                  currentActivityName={currentActivityName!}
                  currentSecondLevelStep={currentSecondLevelStep!}
                  totalActivities={totalActivities!}
                />
              </Box>
            </Box>
          </Box>
        )}
      </YStack>
    </Box>
  );
};

export default ProcessingAnswers;
