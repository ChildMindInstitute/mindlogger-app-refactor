import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getDefaultUploadProgressObservable } from '@app/shared/lib/observables/uploadProgressObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getDefaultAnswersQueueService } from './answersQueueServiceInstance';
import { getDefaultAnswersUploadService } from './answersUploadServiceInstance';
import { QueueProcessingService } from './QueueProcessingService';

let instance: QueueProcessingService;
export const getDefaultQueueProcessingService = () => {
  if (!instance) {
    instance = new QueueProcessingService(
      getDefaultUploadObservable(),
      getDefaultUploadProgressObservable(),
      getDefaultAnswersQueueService(),
      getDefaultAnswersUploadService(),
      getDefaultLogger(),
    );
  }
  return instance;
};
