import { FileSystem } from 'react-native-file-access';

import {
  useBaseMutation,
  AnswerService,
  MutationOptions,
  FileService,
  AnswerDto,
  AppletEncryptionDTO,
} from '@app/shared/api';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption } from '@shared/lib';

type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[];
  appletEncryption: AppletEncryptionDTO;
  itemIds: any[];
  flowId: string | null;
  activityId: string;
};

type Options = MutationOptions<typeof sendAnswers>;

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

const uploadAnswerMediaFiles = async (body: SendAnswersInput) => {
  for (const itemAnswer of body.answers) {
    if (!itemAnswer) {
      continue;
    }

    const { value: answerValue } = itemAnswer;

    const isMediaItem = answerValue?.uri && isFileUrl(answerValue.uri);

    if (isMediaItem) {
      const localFileExists = await FileSystem.exists(answerValue.uri);
      if (localFileExists) {
        try {
          const uploadResult = await FileService.upload(answerValue);

          const url = uploadResult?.data.result.url;

          if (url) {
            itemAnswer.value = url;
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

const encryptAnswers = (data: SendAnswersInput) => {
  const { appletEncryption } = data;
  const userPrivateKey = UserPrivateKeyRecord.get();

  if (!userPrivateKey) {
    throw new Error('User private key is undefined');
  }

  const { encrypt } = encryption.createEncryptionService({
    ...appletEncryption,
    privateKey: userPrivateKey,
  });

  const encryptedAnswers = encrypt(JSON.stringify(data.answers));

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: JSON.parse(appletEncryption.prime),
    appletBase: JSON.parse(appletEncryption.base),
  });

  const encryptedData = {
    appletId: data.appletId,
    version: data.version,
    appletEncryption: undefined,
    answers: [
      {
        answer: encryptedAnswers,
        activityId: data.activityId,
        flowId: data.flowId,
        itemIds: data.itemIds,
      },
    ],
    userPublicKey: JSON.stringify(userPublicKey),
    createdAt: data.createdAt,
  };
  return encryptedData;
};
const sendAnswers = async (body: SendAnswersInput) => {
  const data = await uploadAnswerMediaFiles(body);
  const encryptedData = encryptAnswers(data);

  return AnswerService.sendActivityAnswers(encryptedData);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useBaseMutation(sendAnswers, options);
};
