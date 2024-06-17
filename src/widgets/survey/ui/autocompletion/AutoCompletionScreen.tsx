import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useRetryUpload } from '@entities/activity';
import useQueueProcessing from '@entities/activity/lib/hooks/useQueueProcessing.ts';
import { useAutoCompletion } from '@widgets/survey/model';

import AnswersSubmitted from './AnswersSubmitted';
import { SubScreenContainer } from './common';
import ProcessingAnswers from './ProcessingAnswers';
import TimesUp from './TimesUp';

const AutoCompletionScreen: FC = () => {
  const { goBack } = useNavigation();
  const {
    isCompleted,
    isLoading,
    process: processQueue,
  } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpen, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
      onPostpone: goBack,
    });

  const { process: processWithAutocompletion } = useAutoCompletion();

  const processAnswers = async () => {
    const success = await processWithAutocompletion();

    if (!success) {
      openRetryAlert();
    }
  };

  if (isRetryAlertOpen) {
    return <SubScreenContainer />;
  }

  if (isCompleted) {
    return (
      <SubScreenContainer>
        <AnswersSubmitted onPressDone={goBack} />
      </SubScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <SubScreenContainer>
        <ProcessingAnswers />
      </SubScreenContainer>
    );
  }

  return (
    <SubScreenContainer>
      <TimesUp onPressDone={processAnswers} />
    </SubScreenContainer>
  );
};

export default AutoCompletionScreen;
