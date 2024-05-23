import { useEffect } from 'react';

import {
  ChangeQueueObservable,
  Logger,
  UploadObservable,
  useAppSelector,
  useForceUpdate,
} from '@app/shared/lib';
import { AppletModel } from '@entities/applet';

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

const useQueueProcessing = (): Result => {
  const update = useForceUpdate();

  const appletsConsents = useAppSelector(state =>
    AppletModel.selectors.selectConsents(state),
  );

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
  }, [appletsConsents, update]);

  const processQueueWithSendingLogs = async (): Promise<boolean> => {
    const result = await QueueProcessingService.process(appletsConsents);
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

export default useQueueProcessing;
