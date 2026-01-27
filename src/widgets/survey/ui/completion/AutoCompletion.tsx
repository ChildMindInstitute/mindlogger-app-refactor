import { FC, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';

import { AnswersSubmitted } from './AnswersSubmitted';
import { SubScreenContainer } from './containers';
import { ProcessingAnswers } from './ProcessingAnswers';
import { useAutoCompletion } from '../../model/hooks/useAutoCompletion';

export const AutoCompletion: FC = () => {
  const logger = getDefaultLogger();
  const { goBack } = useNavigation();
  const { isCompleted, process: processQueue } = useQueueProcessing();
  
  logger.log('[AutoCompletion] Component mounted/rendered, isCompleted=' + isCompleted);

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
    logger.log('[AutoCompletion.processAnswers] Started');
    
    // Wait for any ongoing auto-completion to finish
    const mutex = getMutexDefaultInstanceManager().getAutoCompletionMutex();
    const uploadObservable = getDefaultUploadObservable();
    
    logger.log(
      '[AutoCompletion.processAnswers] Initial state: ' +
      `mutexBusy=${mutex.isBusy()}, ` +
      `isCompleted=${uploadObservable.isCompleted}, ` +
      `isLoading=${uploadObservable.isLoading}, ` +
      `isError=${uploadObservable.isError}`
    );
    
    // If mutex is busy, wait a bit for it to be released
    if (mutex.isBusy()) {
      logger.log('[AutoCompletion.processAnswers] Mutex is busy, waiting for release...');
      
      // Wait up to 2 seconds for mutex to be released
      const maxWaitTime = 2000;
      const checkInterval = 100;
      let waited = 0;
      
      while (mutex.isBusy() && waited < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
      }
      
      logger.log(
        `[AutoCompletion.processAnswers] After waiting ${waited}ms: ` +
        `mutexBusy=${mutex.isBusy()}, ` +
        `isCompleted=${uploadObservable.isCompleted}, ` +
        `isLoading=${uploadObservable.isLoading}`
      );
      
      // After waiting, check if everything is already done
      if (uploadObservable.isCompleted) {
        logger.log('[AutoCompletion.processAnswers] Work already completed by background, returning early');
        return;
      }
    }

    logger.log('[AutoCompletion.processAnswers] Calling processWithAutocompletion...');
    const success = await processWithAutocompletion();
    
    logger.log(
      `[AutoCompletion.processAnswers] processWithAutocompletion returned: ${success}, ` +
      `isCompleted=${uploadObservable.isCompleted}, ` +
      `isPostponed=${uploadObservable.isPostponed}, ` +
      `isError=${uploadObservable.isError}`
    );

    if (uploadObservable.isPostponed) {
      logger.log('[AutoCompletion.processAnswers] Upload postponed, going back');
      goBack();
    }

    if (!success) {
      logger.log('[AutoCompletion.processAnswers] Upload failed, opening retry alert');
      openRetryAlert();
    }
    
    logger.log('[AutoCompletion.processAnswers] Completed');
  };

  useEffect(() => {
    logger.log('[AutoCompletion.useEffect] Mounting, calling processAnswers');
    processAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRetryAlertOpen) {
    logger.log('[AutoCompletion.render] Showing retry alert container');
    return <SubScreenContainer />;
  }

  if (isCompleted) {
    logger.log('[AutoCompletion.render] Showing AnswersSubmitted screen');
    return (
      <SubScreenContainer>
        <AnswersSubmitted onPressDone={goBack} />
      </SubScreenContainer>
    );
  }

  logger.log('[AutoCompletion.render] Showing ProcessingAnswers screen');
  return (
    <SubScreenContainer>
      <ProcessingAnswers />
    </SubScreenContainer>
  );
};
