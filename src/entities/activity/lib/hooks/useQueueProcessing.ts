import { useEffect } from 'react';

import {
  ChangeQueueObservable,
  Logger,
  UploadObservable,
  useForceUpdate,
} from '@app/shared/lib';

import { QueueProcessingService } from '../services';
import AnswersQueueService from '../services/AnswersQueueService';
import { SendAnswersInput } from '../types';

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

    UploadObservable.addObserver(onChangeUploadState);

    ChangeQueueObservable.addObserver(onChangeQueue);

    return () => {
      UploadObservable.removeObserver(onChangeUploadState);

      ChangeQueueObservable.removeObserver(onChangeQueue);
    };
  }, [update]);

  const processQueueWithSendingLogs = async (): Promise<boolean> => {
    const result = await QueueProcessingService.process();
    Logger.send();
    return result;
  };

  return {
    process: processQueueWithSendingLogs,
    push: QueueProcessingService.push.bind(QueueProcessingService),
    hasItemsInQueue: AnswersQueueService.getLength() > 0,
    isLoading: UploadObservable.isLoading,
    isError: UploadObservable.isError,
    isPostponed: UploadObservable.isPostponed,
    isCompleted: UploadObservable.isCompleted,
  };
};
