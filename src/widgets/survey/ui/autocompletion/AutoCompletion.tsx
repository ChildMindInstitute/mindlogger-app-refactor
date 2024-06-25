import { FC, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { UploadObservable } from '@app/shared/lib';
import { useRetryUpload } from '@entities/activity';
import useQueueProcessing from '@entities/activity/lib/hooks/useQueueProcessing.ts';
import { useAutoCompletion } from '@widgets/survey/model';

import AnswersSubmitted from './AnswersSubmitted';
import { SubScreenContainer } from './common';
import Loading from './Loading';
import ProcessingAnswers from './ProcessingAnswers';

const AutoCompletion: FC = () => {
  const { goBack } = useNavigation();
  const {
    isCompleted,
    isLoading: isUploading,
    process: processQueue,
  } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpen, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: async () => {
        const retryResult = await processQueue();

        if (UploadObservable.isPostponed) {
          goBack();
        }

        return retryResult;
      },
      onPostpone: goBack,
    });

  const { process: processWithAutocompletion } = useAutoCompletion();

  const processAnswers = async () => {
    const success = await processWithAutocompletion();

    if (UploadObservable.isPostponed) {
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

  if (isUploading) {
    return (
      <SubScreenContainer>
        <ProcessingAnswers />
      </SubScreenContainer>
    );
  }

  return <Loading />;
};

export default AutoCompletion;
