import { FC, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useForceUpdate, useUploadProgress } from '@app/shared/lib';
import { Box, Text, YStack } from '@shared/ui';

const ProcessingAnswers: FC = () => {
  const { t } = useTranslation();

  const progress = useUploadProgress();

  const update = useForceUpdate();

  useEffect(() => {
    console.log(progress.currentSecondLevelStep);
    update();
  }, [progress.currentSecondLevelStep]);

  // TODO, for now - just a draft

  return (
    <>
      <Box flex={1} justifyContent="center">
        <YStack>
          <Text
            marginBottom={24}
            fontSize={31}
            fontWeight="600"
            alignSelf="center"
          >
            {t('autocompletion:processing_answers')}
          </Text>

          <Text
            marginBottom={16}
            fontSize={18}
            textAlign="center"
            alignSelf="center"
          >
            {t('autocompletion:preparing_answers')}
          </Text>

          {progress.isValid && (
            <Box backgroundColor={'white'} borderRadius={10}>
              <Box
                height={107}
                justifyContent="center"
                flexDirection="row"
                alignItems="center"
                backgroundColor={'#D2E2EC4D'}
              >
                <Box width={90} height={90} marginHorizontal={8}>
                  <Box flex={1} alignItems="center" justifyContent="center">
                    <Box
                      width={80}
                      height={80}
                      borderColor={'#D8E4ED'}
                      borderWidth={10}
                      borderRadius={39}
                    />
                  </Box>
                </Box>

                <Box flex={1} height={90}>
                  <YStack>
                    <Text
                      fontSize={12}
                      fontWeight={'700'}
                      lineHeight={27}
                      color={'#02649B'}
                    >
                      {`Activity ${progress.currentActivity + 1} of ${progress.totalActivities}`}
                    </Text>
                    <Text
                      fontSize={16}
                      fontWeight={'700'}
                      lineHeight={27}
                      color={'#1A1C1E'}
                      numberOfLines={1}
                    >
                      {progress.currentActivityName}
                    </Text>
                    <Text
                      fontSize={12}
                      fontWeight={'400'}
                      lineHeight={27}
                      color={'#1A1C1E'}
                      letterSpacing={0.1}
                    >
                      {`${progress.currentSecondLevelStep}, step: ${progress.currentStep!} of ${progress.totalSteps}`}
                    </Text>
                  </YStack>
                </Box>
              </Box>
            </Box>
          )}
        </YStack>
      </Box>
    </>
  );
};

export default ProcessingAnswers;
