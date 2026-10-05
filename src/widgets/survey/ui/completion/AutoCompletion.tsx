import { FC, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';

import { AnswersSubmitted } from './AnswersSubmitted';
import { SubScreenContainer } from './containers';
import { ProcessingAnswers } from './ProcessingAnswers';
import { useAutoCompletion } from '../../model/hooks/useAutoCompletion';

export const AutoCompletion: FC = () => {
  const { goBack } = useNavigation();
  const { isCompleted, process: processQueue } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpen, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: async () => {
        const retryResult = await processQueue();

        if (getDefaultUploadObservable().isPostponed) {
          goBack();
        }

        return retryResult;
      },
      onPostpone: goBack,
    });

  const { process: processWithAutocompletion } = useAutoCompletion();

  const processAnswers = async () => {
    // Wait for any ongoing auto-completion to finish
    const mutex = getMutexDefaultInstanceManager().getAutoCompletionMutex();
    const uploadObservable = getDefaultUploadObservable();

    // If mutex is busy, wait a bit for it to be released
    if (mutex.isBusy()) {
      // Wait up to 2 seconds for mutex to be released
      const maxWaitTime = 2000;
      const checkInterval = 100;
      let waited = 0;

      while (mutex.isBusy() && waited < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
      }

      // After waiting, check if everything is already done
      if (uploadObservable.isCompleted) {
        return;
      }
    }

    const success = await processWithAutocompletion();

    if (uploadObservable.isPostponed) {
      goBack();
    }

    if (!success) {
      openRetryAlert();
    }
  };

  useEffect(() => {
    processAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <SubScreenContainer>
      <ProcessingAnswers />
    </SubScreenContainer>
  );
};
