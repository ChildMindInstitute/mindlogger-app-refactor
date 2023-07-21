import { useEffect } from 'react';

import { useForceUpdate } from '@app/shared/lib';

import { ChangeQueueObservable, UploadObservable } from '../observables';
import { QueueProcessingService } from '../services';
import AnswersQueueService from '../services/AnswersQueueService';
import { SendAnswersInput } from '../types';

type Result = {
  process(): Promise<boolean>;
  push(input: SendAnswersInput): void;
  hasItemsInQueue: boolean;
  isLoading: boolean;
  isError: boolean;
};

const useQueueProcessing = (): Result => {
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

  const process = () => {
    return QueueProcessingService.process();
  };

  return {
    process,
    push: QueueProcessingService.push.bind(QueueProcessingService),
    isError: UploadObservable.isError,
    isLoading: UploadObservable.isLoading,
    hasItemsInQueue: AnswersQueueService.getLength() > 0,
  };
};

export default useQueueProcessing;
