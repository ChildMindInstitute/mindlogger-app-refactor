import {
  useBaseMutation,
  AnswerService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof AnswerService.sendActivityAnswers>;

export const useActivityAnswersMutation = (options?: Options) => {
  return useBaseMutation(
    ['activity-answers'],
    AnswerService.sendActivityAnswers,
    options,
  );
};
