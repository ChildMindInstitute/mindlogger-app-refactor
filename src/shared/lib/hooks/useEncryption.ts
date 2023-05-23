import { useCallback } from 'react';

import { type AppletEncryptionDTO } from '@shared/api';

import { encryption } from '../encryption';

type InputProps = AppletEncryptionDTO & {
  privateKey: number[];
};

type GenerateUserPrivateKeyParams = {
  userId: string;
  email: string;
  password: string;
};

type GenerateAesKeyProps = {
  privateKey: number[];
  publicKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

const useEncryption = () => {
  const generateUserPrivateKey = useCallback(
    (params: GenerateUserPrivateKeyParams) => {
      return encryption.getPrivateKey(params);
    },
    [],
  );

  const generateAesKey = useCallback((params: GenerateAesKeyProps) => {
    return encryption.getAESKey(params);
  }, []);

  const createEncryptionService = (params: InputProps) => {
    const aesKey = generateAesKey({
      appletPrime: JSON.parse(params.prime),
      appletBase: JSON.parse(params.base),
      publicKey: JSON.parse(params.publicKey),
      privateKey: params.privateKey,
    });

    const encrypt = (json: string) => {
      return encryption.encryptData({
        text: json,
        key: aesKey,
      });
    };

    return { encrypt };
  };

  return {
    createEncryptionService,
    generateUserPrivateKey,
  };
};

export default useEncryption;
