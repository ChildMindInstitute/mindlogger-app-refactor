import { IUploadObservable } from '@app/shared/lib/observables/IUploadObservable';
import { IUploadProgressObservable } from '@app/shared/lib/observables/IUploadProgressObservable';
import { ILogger } from '@app/shared/lib/types/logger';
import { IPreprocessor } from '@app/shared/lib/types/service';
import { Mutex, wait } from '@app/shared/lib/utils/common';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';
import {
  IAnswersQueueService,
  UploadItem,
} from '@entities/activity/lib/services/IAnswersQueueService';
import { IAnswersUploadService } from '@entities/activity/lib/services/IAnswersUploadService';
import { IQueueProcessingService } from '@entities/activity/lib/services/IQueueProcessingService';
import { IMutex } from '@shared/lib/utils/IMutex';

import { UploadItemPreprocessor } from './UploadItemPreprocessor';
import { SendAnswersInput } from '../types/uploadAnswers';

export class QueueProcessingService implements IQueueProcessingService {
  private queueService: IAnswersQueueService;

  private uploadService: IAnswersUploadService;

  private uploadStatusObservable: IUploadObservable;

  private uploadProgressObservable: IUploadProgressObservable;

  private mutex: IMutex;

  private logger: ILogger;

  private itemPreprocessor: IPreprocessor<UploadItem>;

  constructor(
    updateObservable: IUploadObservable,
    uploadProgressObservable: IUploadProgressObservable,
    queueService: IAnswersQueueService,
    uploadService: IAnswersUploadService,
    logger: ILogger,
  ) {
    this.uploadStatusObservable = updateObservable;

    this.uploadProgressObservable = uploadProgressObservable;

    this.queueService = queueService;

    this.uploadService = uploadService;

    this.logger = logger;

    this.mutex = Mutex();

    this.itemPreprocessor = new UploadItemPreprocessor();
  }

  private async processInternal(): Promise<boolean> {
    const queueLength = this.queueService.getLength();

    for (let i = 0; i < queueLength; i++) {
      const uploadItem = this.queueService.pick();

      if (!uploadItem) {
        return true;
      }

      const logEntity = `"${uploadItem.input.activityName}, which completed at ${uploadItem.input.logCompletedAt}"`;

      try {
        this.uploadProgressObservable.totalActivities = queueLength;
        this.uploadProgressObservable.currentActivity = i;
        this.uploadProgressObservable.currentActivityName =
          uploadItem.input.activityName;

        this.logger.info(
          `[QueueProcessingService:processInternal]: Processing activity ${logEntity}`,
        );

        this.itemPreprocessor.preprocess(uploadItem);

        await this.uploadService.sendAnswers(uploadItem.input);

        this.queueService.dequeue();

        this.logger.info(
          `[QueueProcessingService:processInternal] Queue item with activity ${logEntity} processed`,
        );
      } catch (error) {
        this.logger.warn(
          `[QueueProcessingService:processInternal] Error occurred while executing sendAnswers for ${logEntity}.\nInternal error:\n\n` +
            error,
        );

        this.queueService.swap();
      } finally {
        this.uploadProgressObservable.reset();
      }
    }

    return this.queueService.getLength() === 0;
  }

  public async process(): Promise<boolean> {
    if (this.mutex.isBusy()) {
      this.logger.log('[QueueProcessingService.process]: Mutex is busy');
      return true;
    }

    try {
      this.mutex.setBusy();

      this.uploadStatusObservable.isLoading = true;
      this.uploadStatusObservable.isCompleted = false;
      this.uploadStatusObservable.isPostponed = false;
      this.uploadStatusObservable.isError = false;

      this.uploadProgressObservable.reset();

      await wait(100);

      const online = await isAppOnline();

      if (!online) {
        this.logger.log(
          '[QueueProcessingService.process]: Application is offline',
        );
        this.uploadStatusObservable.isPostponed = true;
        return true;
      }

      const success = await this.processInternal();

      this.uploadStatusObservable.isError = !success;
      this.uploadStatusObservable.isCompleted = success;

      return success;
    } catch (error) {
      this.logger.warn(
        `[QueueProcessingService.process]: Error in processInternal occurred\n\n${error}`,
      );
      this.uploadStatusObservable.isError = true;
    } finally {
      this.mutex.release();
      this.uploadStatusObservable.isLoading = false;
    }
    return false;
  }

  public push(input: SendAnswersInput) {
    this.queueService.enqueue({ input });
  }
}
