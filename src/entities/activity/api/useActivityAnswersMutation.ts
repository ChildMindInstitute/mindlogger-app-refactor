import { useMutation } from '@tanstack/react-query';

import { MutationOptions } from '@app/shared/api';
import { wait } from '@app/shared/lib';

import { SendAnswersInput, AnswersUploadService } from '../lib';

type Options = MutationOptions<typeof sendAnswers>;

export const sendAnswers = async (body: SendAnswersInput) => {
  // This delay is for postponing encryption operation which blocks the UI thread
  await wait(100);

  return AnswersUploadService.sendAnswers(body);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useMutation({ mutationKey: ['send_answers'], ...options });
};
