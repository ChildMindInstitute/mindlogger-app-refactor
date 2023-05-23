import { useCallback } from 'react';

import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { AnswerDto, AppletEncryptionDTO } from '@shared/api';
import { useEncryption } from '@shared/lib';

type AnswerPayload = {
  answers: Array<AnswerDto>;
};

type Response = {
  activityItemId: string;
  answer: string;
};

export const useEncryptAnswers = () => {
  const { createEncryptionService } = useEncryption();

  const encryptAnswers = useCallback(
    (
      encryptionParams: AppletEncryptionDTO | null,
      answerPayload: AnswerPayload,
    ): Response[] => {
      if (!encryptionParams) {
        throw new Error('Encryption params is undefined');
      }

      const userPrivateKey = UserPrivateKeyRecord.get();

      if (!userPrivateKey) {
        throw new Error('User private key is undefined');
      }

      const encryptionService = createEncryptionService({
        ...encryptionParams,
        privateKey: userPrivateKey,
      });

      return answerPayload.answers.map(answerItem => {
        const encryptedAnswer = encryptionService.encrypt(
          JSON.stringify(answerItem.answer),
        );

        return {
          ...answerItem,
          answer: encryptedAnswer,
        };
      });
    },
    [createEncryptionService],
  );

  return {
    encryptAnswers,
  };
};
