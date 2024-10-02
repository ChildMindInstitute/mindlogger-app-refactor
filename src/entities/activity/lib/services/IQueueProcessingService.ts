import { SendAnswersInput } from '@entities/activity/lib/types/uploadAnswers.ts';

export interface IQueueProcessingService {
  push(input: SendAnswersInput): void;
}
