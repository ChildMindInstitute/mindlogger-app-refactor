import { SendAnswersInput } from '@entities/activity/lib/types/uploadAnswers';

export type UploadItem = {
  input: SendAnswersInput;
};

export interface IAnswersQueueService {
  pick: () => UploadItem | null;
  enqueue: (item: UploadItem) => void;
  dequeue: () => void;
  swap: () => void;
  getLength: () => number;
}
