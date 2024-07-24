import {
  ILogger,
  IMutex,
  Logger,
  Mutex,
  isAppOnline,
  wait,
  IUploadObservableSetters,
  UploadObservable,
  IUploadProgressObservableSetters,
  UploadProgressObservable,
  IPreprocessor,
} from '@app/shared/lib';

import AnswersQueueService, {
  IAnswersQueueService,
  UploadItem,
} from './AnswersQueueService';
import AnswersUploadService, {
  IAnswersUploadService,
} from './AnswersUploadService';
import UploadItemPreprocessor from './UploadItemPreprocessor';
import { SendAnswersInput } from '../types';

export interface IPushToQueue {
  push(input: SendAnswersInput): void;
}

class QueueProcessingService implements IPushToQueue {
  private queueService: IAnswersQueueService;

  private uploadService: IAnswersUploadService;

  private uploadStatusObservable: IUploadObservableSetters;

  private uploadProgressObservable: IUploadProgressObservableSetters;

  private mutex: IMutex;

  private logger: ILogger;

  private itemPreprocessor: IPreprocessor<UploadItem>;

  constructor(
    updateObservable: IUploadObservableSetters,
    uploadProgressObservable: IUploadProgressObservableSetters,
    queueService: IAnswersQueueService,
    logger: ILogger,
  ) {
    this.uploadStatusObservable = updateObservable;

    this.uploadProgressObservable = uploadProgressObservable;

    this.queueService = queueService;

    this.uploadService = AnswersUploadService;

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

export default new QueueProcessingService(
  UploadObservable,
  UploadProgressObservable,
  AnswersQueueService,
  Logger,
);
