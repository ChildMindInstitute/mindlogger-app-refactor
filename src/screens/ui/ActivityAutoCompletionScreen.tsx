import { FC, PropsWithChildren } from 'react';

import { useNavigation } from '@react-navigation/native';
import { YStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { useRetryUpload } from '@entities/activity';
import useQueueProcessing from '@entities/activity/lib/hooks/useQueueProcessing.ts';
import {
  Box,
  BoxProps,
  CheckIcon,
  ImageBackground,
  Spinner,
  SubmitButton,
  Text,
  TimerSandIcon,
} from '@shared/ui';
import { useAutoCompletion } from '@widgets/survey/model';

type Props = {
  onPressDone?: () => void;
};

type FlexContainerProps = PropsWithChildren<BoxProps>;

const FlexContainer: FC<FlexContainerProps> = ({ children, ...boxProps }) => {
  return (
    <YStack flex={1} alignItems="center" gap={20} {...boxProps}>
      {children}
    </YStack>
  );
};

const MainContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ImageBackground>
      <YStack flex={1} px={20} gap={20}>
        {children}
      </YStack>
    </ImageBackground>
  );
};

const TimesUpScreen: FC<Props> = ({ onPressDone }) => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <TimerSandIcon color="#000" size={80} />
        <Text fontSize={25}>{t('autocompletion:time_limit_reached')}</Text>
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <Text textAlign="center">
          {t('autocompletion:time_expired', {
            activityNames: '[First Activity, Second Activity]',
          })}
        </Text>

        <Box w="100%">
          <SubmitButton
            accessibilityLabel="autocompletion-times-up"
            mode="dark"
            onPress={onPressDone}
            borderRadius={20}
          >
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};

const ProcessingAnswersScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <Spinner size={80} />
        <Text fontSize={25}>{t('autocompletion:processing_answers')}</Text>
      </FlexContainer>

      <FlexContainer justifyContent="flex-start">
        <Text textAlign="center">{t('autocompletion:preparing_answers')}</Text>
      </FlexContainer>
    </>
  );
};

const AnswersSubmittedScreen: FC<Props> = ({ onPressDone }) => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <Box bg="$alertSuccessIcon" borderRadius={100} p={10}>
          <CheckIcon color="white" size={60} />
        </Box>
        <Text fontSize={25}>{t('autocompletion:answers_submitted')}</Text>
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <Box w="100%">
          <SubmitButton
            accessibilityLabel="autocomplete-answers-submitted"
            mode="dark"
            onPress={onPressDone}
            borderRadius={20}
          >
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};

const ActivityAutoCompletionScreen: FC = () => {
  const {
    isCompleted,
    isLoading,
    process: processQueue,
  } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpen, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
    });

  const { process: processWithAutocompletion } = useAutoCompletion();
  const { goBack } = useNavigation();

  const processAnswers = async () => {
    const success = await processWithAutocompletion();

    if (!success) {
      openRetryAlert();
    }
  };

  if (isRetryAlertOpen) {
    return <MainContainer />;
  }

  if (isCompleted) {
    return (
      <MainContainer>
        <AnswersSubmittedScreen onPressDone={goBack} />
      </MainContainer>
    );
  }

  if (isLoading) {
    return (
      <MainContainer>
        <ProcessingAnswersScreen />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <TimesUpScreen onPressDone={processAnswers} />
    </MainContainer>
  );
};

export default ActivityAutoCompletionScreen;
