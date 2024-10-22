import { useEffect } from 'react';

import { useForceUpdate } from '@app/shared/lib/hooks/useForceUpdate';
import { getDefaultChangeQueueObservable } from '@app/shared/lib/observables/changeQueueObservableInstance';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getDefaultAnswersQueueService } from '../services/answersQueueServiceInstance';
import { getDefaultQueueProcessingService } from '../services/queueProcessingServiceInstance';
import { SendAnswersInput } from '../types/uploadAnswers';

type Result = {
  process(): Promise<boolean>;
  push(input: SendAnswersInput): void;
  hasItemsInQueue: boolean;
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  isPostponed: boolean;
};

export const useQueueProcessing = (): Result => {
  const update = useForceUpdate();

  useEffect(() => {
    const onChangeUploadState = () => {
      update();
    };

    const onChangeQueue = () => {
      update();
    };

    getDefaultUploadObservable().addObserver(onChangeUploadState);

    getDefaultChangeQueueObservable().addObserver(onChangeQueue);

    return () => {
      getDefaultUploadObservable().removeObserver(onChangeUploadState);

      getDefaultChangeQueueObservable().removeObserver(onChangeQueue);
    };
  }, [update]);

  const queueProcessingService = getDefaultQueueProcessingService();

  const processQueueWithSendingLogs = async (): Promise<boolean> => {
    const result = await queueProcessingService.process();
    getDefaultLogger().send();
    return result;
  };

  return {
    process: processQueueWithSendingLogs,
    push: queueProcessingService.push.bind(queueProcessingService),
    hasItemsInQueue: getDefaultAnswersQueueService().getLength() > 0,
    isLoading: getDefaultUploadObservable().isLoading,
    isError: getDefaultUploadObservable().isError,
    isPostponed: getDefaultUploadObservable().isPostponed,
    isCompleted: getDefaultUploadObservable().isCompleted,
  };
};
