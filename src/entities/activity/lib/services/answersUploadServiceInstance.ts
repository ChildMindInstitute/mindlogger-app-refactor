import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { getDefaultAnswerService } from '@app/shared/api/services/answerServiceInstance';
import { getDefaultFileService } from '@app/shared/api/services/fileServiceInstance';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { getDefaultUploadProgressObservable } from '@app/shared/lib/observables/uploadProgressObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { AnswersUploadService } from './AnswersUploadService';
import { getDefaultMediaFilesCleaner } from './mediaFilesCleanerInstance';

let instance: AnswersUploadService;
export const getDefaultAnswersUploadService = () => {
  if (!instance) {
    instance = new AnswersUploadService(
      getDefaultLogger(),
      getDefaultUploadProgressObservable(),
      getDefaultMediaFilesCleaner(),
      getDefaultEncryptionManager(),
      getDefaultFileService(),
      getDefaultUserPrivateKeyRecord(),
      getDefaultAnswerService(),
    );
  }
  return instance;
};
