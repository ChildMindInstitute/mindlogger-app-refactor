import { SendAnswersInput } from '@entities/activity/lib/types/uploadAnswers.ts';

export interface IAnswersUploadService {
  sendAnswers(body: SendAnswersInput): Promise<void>;
}
