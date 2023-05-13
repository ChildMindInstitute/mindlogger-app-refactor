import {
  useBaseMutation,
  AnswerService,
  MutationOptions,
  FileService,
} from '@app/shared/api';

type Options = MutationOptions<typeof AnswerService.sendActivityAnswers>;

type Arguments = Parameters<typeof AnswerService.sendActivityAnswers>[0];

const isFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV)$/;

  return localFileRegex.test(value);
};

const sendAnswers = async (body: Arguments) => {
  for (const itemAnswer of body.answers) {
    const { value: answerValue } = itemAnswer.answer;

    if (answerValue?.uri && isFileUrl(answerValue.uri)) {
      const uploadResult = await FileService.upload(answerValue);

      if (uploadResult?.data.result.url) {
        const { url } = uploadResult.data.result;

        itemAnswer.answer.value = url;
      } else {
        const answers = body.answers.filter(
          answer => answer.activityItemId !== itemAnswer.activityItemId,
        );

        body.answers = answers;
      }
    }
  }

  return AnswerService.sendActivityAnswers(body);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useBaseMutation(sendAnswers, options);
};
