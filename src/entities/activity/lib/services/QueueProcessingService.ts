import { IMutex, Mutex, wait } from '@app/shared/lib';

import AnswersQueueService, {
  IAnswersQueueService,
} from './AnswersQueueService';
import AnswersUploadService, {
  IAnswersUploadService,
} from './AnswersUploadService';
import { UploadObservable } from '../observables';
import { IUploadObservableSetters } from '../observables/uploadObservable';
import { SendAnswersInput } from '../types';

class QueueProcessingService {
  private queueService: IAnswersQueueService;

  private uploadService: IAnswersUploadService;

  private uploadStatusObservable: IUploadObservableSetters;

  private mutex: IMutex;

  constructor(
    updateObservable: IUploadObservableSetters,
    queueService: IAnswersQueueService,
  ) {
    this.uploadStatusObservable = updateObservable;

    this.queueService = queueService;

    this.uploadService = AnswersUploadService;

    this.mutex = Mutex();
  }

  public push(input: SendAnswersInput) {
    this.queueService.enqueue({ input });
  }

  private async processInternal(): Promise<boolean> {
    const queueLength = this.queueService.getLength();

    for (let i = 0; i < queueLength; i++) {
      const uploadItem = this.queueService.pick();

      if (!uploadItem) {
        return true;
      }

      try {
        console.info(
          `[QueueProcessingService:process]: Processing activity "${uploadItem.input.debug_activityName}", which completed at ${uploadItem.input.debug_completedAt}`,
        );

        await this.uploadService.sendAnswers(uploadItem?.input);

        this.queueService.dequeue();

        console.info('[QueueProcessingService:process] Queue item processed');
      } catch (error) {
        this.queueService.swap();

        console.warn(
          '[QueueProcessingService:process] Error occurred while sendAnswers\n\n',
          error,
        );
      }
    }

    return this.queueService.getLength() === 0;
  }

  public async process(): Promise<boolean> {
    if (this.mutex.isBusy()) {
      return false;
    }

    try {
      this.mutex.setBusy();

      this.uploadStatusObservable.isLoading = true;

      await wait(100);

      const success = await this.processInternal();

      this.uploadStatusObservable.isError = !success;
      return success;
    } catch {
      this.uploadStatusObservable.isError = true;
    } finally {
      this.mutex.release();
      this.uploadStatusObservable.isLoading = false;
    }
    return false;
  }
}

export default new QueueProcessingService(
  UploadObservable,
  AnswersQueueService,
);
