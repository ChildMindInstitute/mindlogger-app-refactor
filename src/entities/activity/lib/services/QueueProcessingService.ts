import AnswersQueueService, {
  IAnswersQueueService,
} from './AnswersQueueService';
import AnswersUploadService, {
  IAnswersUploadService,
} from './AnswersUploadService';
import { UploadObservable } from '../observables';
import { IUpdateUploadObservable } from '../observables/uploadObservable';
import { SendAnswersInput } from '../types';

class QueueProcessingService {
  private queueService: IAnswersQueueService;

  private uploadService: IAnswersUploadService;

  private uploadStatusObservable: IUpdateUploadObservable;

  constructor(
    updateObservable: IUpdateUploadObservable,
    queueService: IAnswersQueueService,
  ) {
    this.uploadStatusObservable = updateObservable;

    this.queueService = queueService;

    this.uploadService = AnswersUploadService;
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
    try {
      this.uploadStatusObservable.isLoading = true;

      const success = await this.processInternal();

      this.uploadStatusObservable.isError = !success;
      return success;
    } catch {
      this.uploadStatusObservable.isError = true;
    } finally {
      this.uploadStatusObservable.isLoading = false;
    }
    return false;
  }
}

export default new QueueProcessingService(
  UploadObservable,
  AnswersQueueService,
);
