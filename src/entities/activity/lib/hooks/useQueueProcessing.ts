import { useEffect, useState } from 'react';

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
  isCompleted: boolean;
};

const useQueueProcessing = (): Result => {
  const update = useForceUpdate();

  const [isCompleted, setIsCompleted] = useState(false);

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

  const process = async () => {
    setIsCompleted(false);

    const success = await QueueProcessingService.process();

    if (success) {
      setIsCompleted(true);
    }
    return success;
  };

  return {
    process,
    push: QueueProcessingService.push.bind(QueueProcessingService),
    hasItemsInQueue: AnswersQueueService.getLength() > 0,
    isLoading: UploadObservable.isLoading,
    isError: UploadObservable.isError,
    isCompleted,
  };
};

export default useQueueProcessing;
