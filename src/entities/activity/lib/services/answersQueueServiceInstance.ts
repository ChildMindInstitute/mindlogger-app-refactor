import { getDefaultChangeQueueObservable } from '@app/shared/lib/observables/changeQueueObservableInstance';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { AnswersQueueService } from './AnswersQueueService';

let instance: AnswersQueueService;
export const getDefaultAnswersQueueService = () => {
  if (!instance) {
    instance = new AnswersQueueService(
      getDefaultChangeQueueObservable(),
      getDefaultStorageInstanceManager().getUploadQueueStorage(),
    );
  }
  return instance;
};
