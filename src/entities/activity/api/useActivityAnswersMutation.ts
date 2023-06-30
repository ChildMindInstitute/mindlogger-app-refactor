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
  ActivityAnswersRequest,
} from '@app/shared/api';
import { MediaFile } from '@app/shared/ui';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption, wait } from '@shared/lib';

import { MediaFilesCleaner } from '../lib';

type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[];
  appletEncryption: AppletEncryptionDTO;
  itemIds: string[];
  flowId: string | null;
  activityId: string;
  executionGroupKey: string;
  userActions: UserActionDto[];
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userIdentifier?: string;
};

type Options = MutationOptions<typeof sendAnswers>;

const isFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV|svg)$/;

  return localFileRegex.test(value);
};

const uploadAnswerMediaFiles = async (body: SendAnswersInput) => {
  const itemsAnswers = [...body.answers];

  const updatedAnswers = [];

  for (const itemAnswer of itemsAnswers) {
    // Item answer is either string or object.
    if (!isPlainObject(itemAnswer)) {
      updatedAnswers.push(itemAnswer);

      continue;
    }

    const { value: answerValue } = itemAnswer;

    const mediaAnswer = answerValue as MediaFile;

    const isMediaItem = mediaAnswer?.uri && isFileUrl(mediaAnswer.uri);

    if (isMediaItem) {
      const localFileExists = await FileSystem.exists(mediaAnswer.uri);

      if (localFileExists) {
        try {
          const uploadResult = await FileService.upload({
            fileName: mediaAnswer.fileName,
            type: mediaAnswer.type,
            uri: mediaAnswer.uri,
          });

          const url = uploadResult?.data.result.url;

          const isSvg = mediaAnswer.type === 'image/svg';

          if (url && !isSvg) {
            updatedAnswers.push({ value: url });
          } else if (url) {
            (itemAnswer.value as MediaFile).uri = url;
            updatedAnswers.push(itemAnswer);
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      updatedAnswers.push(itemAnswer);
    }
  }

  const updatedBody = { ...body, answers: updatedAnswers };

  return updatedBody;
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

  const identifier = data.userIdentifier && encrypt(data.userIdentifier);

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: JSON.parse(appletEncryption.prime),
    appletBase: JSON.parse(appletEncryption.base),
  });

  const encryptedData: ActivityAnswersRequest = {
    appletId: data.appletId,
    version: data.version,
    flowId: data.flowId,
    submitId: data.executionGroupKey,
    activityId: data.activityId,
    answer: {
      answer: encryptedAnswers,
      itemIds: data.itemIds,
      events: encryptedUserActions,
      startTime: data.startTime,
      endTime: data.endTime,
      scheduledTime: data.scheduledTime,
      userPublicKey: JSON.stringify(userPublicKey),
      identifier,
    },
    createdAt: data.createdAt,
  };

  return encryptedData;
};
export const sendAnswers = async (body: SendAnswersInput) => {
  // This delay is for postponing encryption operation which blocks the UI thread
  await wait(100);

  const data = await uploadAnswerMediaFiles(body);

  const encryptedData = encryptAnswers(data);

  return AnswerService.sendActivityAnswers(encryptedData).then(result => {
    MediaFilesCleaner.cleanUpByAnswers(body.answers);

    return result;
  });
};

export const useActivityAnswersMutation = (options?: Options) => {
  return useMutation({ mutationKey: ['send_answers'], ...options });
};
