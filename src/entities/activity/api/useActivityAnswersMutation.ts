import { isPlainObject } from '@reduxjs/toolkit';
import { useMutation } from '@tanstack/react-query';
import { FileSystem } from 'react-native-file-access';

import {
  AnswerService,
  MutationOptions,
  FileService,
  AnswerDto,
  AppletEncryptionDTO,
  UserActionDto,
} from '@app/shared/api';
import { MediaValue } from '@app/shared/ui';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption, wait } from '@shared/lib';

type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[];
  appletEncryption: AppletEncryptionDTO;
  itemIds: string[];
  flowId: string | null;
  activityId: string;
  userActions: UserActionDto[];
};

type Options = MutationOptions<typeof sendAnswers>;

const isFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV)$/;

  return localFileRegex.test(value);
};

const filterMediaAnswers = (
  answers: AnswerDto[],
  answerFilter: AnswerDto,
): AnswerDto[] => answers.filter(answer => answer !== answerFilter);

const uploadAnswerMediaFiles = async (body: SendAnswersInput) => {
  for (const itemAnswer of body.answers) {
    if (!isPlainObject(itemAnswer)) {
      continue;
    }

    const { value: answerValue } = itemAnswer;

    const mediaAnswer = answerValue as MediaValue;

    const isMediaItem = mediaAnswer?.uri && isFileUrl(mediaAnswer.uri);

    if (isMediaItem) {
      const localFileExists = await FileSystem.exists(mediaAnswer.uri);
      if (localFileExists) {
        try {
          const uploadResult = await FileService.upload(mediaAnswer);

          const url = uploadResult?.data.result.url;

          if (url) {
            itemAnswer.value = url;
          }
        } catch (error) {
          const answers = filterMediaAnswers(body.answers, itemAnswer);

          body.answers = answers;

          console.error(error);
        }
      } else {
        const answers = filterMediaAnswers(body.answers, itemAnswer);

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

  const encryptedUserActions = encrypt(JSON.stringify(data.userActions));

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: JSON.parse(appletEncryption.prime),
    appletBase: JSON.parse(appletEncryption.base),
  });

  const encryptedData = {
    appletId: data.appletId,
    version: data.version,
    answers: [
      {
        answer: encryptedAnswers,
        activityId: data.activityId,
        flowId: data.flowId,
        itemIds: data.itemIds,
        events: encryptedUserActions,
      },
    ],
    userPublicKey: JSON.stringify(userPublicKey),
    createdAt: data.createdAt,
  };
  return encryptedData;
};
export const sendAnswers = async (body: SendAnswersInput) => {
  // This delay is for postponing encryption operation which blocks the UI thread
  await wait(100);

  const data = await uploadAnswerMediaFiles(body);
  const encryptedData = encryptAnswers(data);

  return AnswerService.sendActivityAnswers(encryptedData);
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useMutation({ mutationKey: ['send_answers'], ...options });
};
