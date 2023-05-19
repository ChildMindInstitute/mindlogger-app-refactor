import { useCallback } from 'react';

import { encryption } from '../encryption';

type GenerateUserPrivateKeyParams = {
  userId: string;
  email: string;
  password: string;
};

type GenerateUserPublicKeyParams = {
  privateKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

type GenerateAesKeyProps = {
  userPrivateKey: number[];
  appletPublicKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

type EncryptDataByKeyProps = {
  text: string;
  key: number[];
};

type DecryptDataByKeyProps = {
  text: string;
  key: string;
};

const useEncryption = () => {
  const generateUserPrivateKey = useCallback(
    (params: GenerateUserPrivateKeyParams) => {
      return encryption.getPrivateKey(params);
    },
    [],
  );

  const generateUserPublicKey = useCallback(
    (params: GenerateUserPublicKeyParams) => {
      return encryption.getPublicKey(params);
    },
    [],
  );

  const generateAesKey = useCallback((params: GenerateAesKeyProps) => {
    return encryption.getAESKey(params);
  }, []);

  const encryptDataByKey = useCallback((props: EncryptDataByKeyProps) => {
    return encryption.encryptData(props);
  }, []);

  const decryptDataByKey = useCallback((props: DecryptDataByKeyProps) => {
    return encryption.decryptData(props);
  }, []);

  return {
    generateAesKey,
    encryptDataByKey,
    decryptDataByKey,
    generateUserPrivateKey,
    generateUserPublicKey,
  };
};

export default useEncryption;
