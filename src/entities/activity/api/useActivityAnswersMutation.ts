import { FileSystem } from 'react-native-file-access';

import {
  useBaseMutation,
  AnswerService,
  MutationOptions,
  FileService,
  AnswerDto,
} from '@app/shared/api';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption } from '@shared/lib';

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
  answers.filter(answer => answer.activityId !== answerFilter.activityId);

const uploadAnswerMediaFiles = async (body: Arguments) => {
  for (const itemAnswer of body.answers) {
    const { value: answerValue } = itemAnswer.answer;

    const isMediaItem = answerValue?.uri && isFileUrl(answerValue.uri);

    const localFileExists = await FileSystem.exists(answerValue.uri);

    if (isMediaItem) {
      if (localFileExists) {
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
  }
  return body;
};

const encryptAnswers = (data: Arguments) => {
  if (!data?.appletEncryption) {
    throw new Error('Encryption params is undefined');
  }
  const { appletEncryption } = data;
  const userPrivateKey = UserPrivateKeyRecord.get();

  if (!userPrivateKey) {
    throw new Error('User private key is undefined');
  }

  const { encrypt } = encryption.createEncryptionService({
    ...appletEncryption,
    privateKey: userPrivateKey,
  });

  const encryptedAnswers = data.answers.map(answerItem => {
    const encryptedAnswer = encrypt(JSON.stringify(answerItem.answer));

    return {
      ...answerItem,
      answer: encryptedAnswer,
    };
  });

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: appletEncryption.prime,
    appletBase: appletEncryption.base,
  });

  const encryptedData = {
    ...data,
    appletEncryption: undefined,
    answers: encryptedAnswers,
    publicKey: JSON.stringify(userPublicKey),
  };
  return encryptedData;
};
const sendAnswers = async (body: Arguments) => {
  const data = await uploadAnswerMediaFiles(body);
  const encryptedData = encryptAnswers(data);
  // @ts-ignore
  return AnswerService.sendActivityAnswers(encryptedData);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useBaseMutation(sendAnswers, options);
};
