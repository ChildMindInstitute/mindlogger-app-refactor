import { SendAnswersInput } from '@entities/activity/lib/types/uploadAnswers';

export interface IAnswersUploadService {
  sendAnswers(body: SendAnswersInput): Promise<void>;
}
