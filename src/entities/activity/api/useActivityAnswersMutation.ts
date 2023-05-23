import { FileSystem } from 'react-native-file-access';

import {
  useBaseMutation,
  AnswerService,
  MutationOptions,
  FileService,
  AnswerDto,
} from '@app/shared/api';

type Options = MutationOptions<typeof AnswerService.sendActivityAnswers>;

type Arguments = Parameters<typeof AnswerService.sendActivityAnswers>[0];

const isFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV)$/;

  return localFileRegex.test(value);
};

const filterAnswers = (
  answers: AnswerDto[],
  answerFilter: AnswerDto,
): AnswerDto[] =>
  answers.filter(
    answer => answer.activityItemId !== answerFilter.activityItemId,
  );

const sendAnswers = async (body: Arguments) => {
  for (const itemAnswer of body.answers) {
    const { value: answerValue } = itemAnswer.answer;

    const fileExists =
      answerValue?.uri &&
      isFileUrl(answerValue.uri) &&
      (await FileSystem.exists(answerValue.uri));

    if (fileExists) {
      try {
        const uploadResult = await FileService.upload(answerValue);

        const url = uploadResult?.data.result.url;

        if (url) {
          itemAnswer.answer.value = url;
        }
      } catch (error) {
        const answers = filterAnswers(body.answers, itemAnswer);

        body.answers = answers;

        console.error(error);
      }
    } else {
      const answers = filterAnswers(body.answers, itemAnswer);

      body.answers = answers;
    }
  }

  return AnswerService.sendActivityAnswers(body);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useBaseMutation(sendAnswers, options);
};
