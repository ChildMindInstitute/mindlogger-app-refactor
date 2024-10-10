import { FC, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';

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
    const success = await processWithAutocompletion();

    if (getDefaultUploadObservable().isPostponed) {
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
