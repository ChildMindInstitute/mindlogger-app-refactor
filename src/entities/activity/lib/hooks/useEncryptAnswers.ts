import { useCallback } from 'react';

import { UserPrivateKeyRecord } from '@entities/identity/lib';
import {
  // AnswerTypesPayload,
  AppletEncryptionDTO,
} from '@shared/api';
import { useEncryption } from '@shared/lib';

type AnswerPayload = {
  answers: Array<any>; //AnswerTypesPayload
};

type EncryptAnswerReturn = {
  activityItemId: string;
  answer: string;
};

export const useEncryptAnswers = () => {
  const { generateAesKey, encryptDataByKey, generateUserPublicKey } =
    useEncryption();

  const encryptAnswers = useCallback(
    (
      encryptionParams: AppletEncryptionDTO | null,
      answerPayload: AnswerPayload,
    ): EncryptAnswerReturn[] => {
      if (!encryptionParams) {
        throw new Error('Encryption params is undefined');
      }

      const userPrivateKey = UserPrivateKeyRecord.get();

      if (!userPrivateKey) {
        throw new Error('User private key is undefined');
      }

      // Need this public key for the future, when BE will be ready
      const userPublicKey = generateUserPublicKey({
        privateKey: userPrivateKey,
        appletPrime: JSON.parse(encryptionParams.prime),
        appletBase: JSON.parse(encryptionParams.base),
      });

      const key = generateAesKey({
        userPrivateKey,
        appletPublicKey: JSON.parse(encryptionParams.publicKey),
        appletPrime: JSON.parse(encryptionParams.prime),
        appletBase: JSON.parse(encryptionParams.base),
      });

      return answerPayload.answers.map(answerItem => {
        const answerJSON = JSON.stringify(answerItem.answer);
        const encryptedAnswer = encryptDataByKey({ text: answerJSON, key });

        return {
          ...answerItem,
          answer: encryptedAnswer,
        };
      });
    },
    [encryptDataByKey, generateAesKey, generateUserPublicKey],
  );

  return {
    encryptAnswers,
  };
};
