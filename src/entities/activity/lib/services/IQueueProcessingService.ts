import { SendAnswersInput } from '@entities/activity/lib/types/uploadAnswers';

export interface IQueueProcessingService {
  push(input: SendAnswersInput): void;
}
