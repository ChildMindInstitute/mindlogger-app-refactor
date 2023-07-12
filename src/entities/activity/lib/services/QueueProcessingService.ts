import AnswersQueueService, {
  IAnswersQueueService,
} from './AnswersQueueService';
import AnswersUploadService, {
  IAnswersUploadService,
} from './AnswersUploadService';
import { SendAnswersInput } from '../types';

class QueueProcessingService {
  private queueService: IAnswersQueueService;

  private uploadService: IAnswersUploadService;

  private onChange: () => void;

  private queueChangeListeners: Array<() => void>;

  constructor() {
    this.onChange = () => {
      for (let l of this.queueChangeListeners) {
        l();
      }
    };

    this.queueChangeListeners = [];

    this.queueService = new AnswersQueueService(this.onChange);

    this.uploadService = AnswersUploadService;
  }

  public addListener(listener: () => void) {
    this.queueChangeListeners.push(listener);
  }

  public removeListener(listener: () => void) {
    this.queueChangeListeners = this.queueChangeListeners.filter(
      x => x === listener,
    );
  }

  public getQueueLength(): number {
    return this.queueService.getLength();
  }

  public push(input: SendAnswersInput) {
    this.queueService.enqueue({ input });
  }

  public async process(): Promise<boolean> {
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
}

export default new QueueProcessingService();
