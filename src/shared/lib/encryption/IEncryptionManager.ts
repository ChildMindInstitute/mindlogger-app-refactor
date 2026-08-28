export type GetPrivateKeyProps = {
  userId: string;
  email: string;
  password: string;
};

export type GetPublicKeyProps = {
  privateKey: number[];
  appletPrime: string | number[] | Uint8Array;
  appletBase: string | number[] | Uint8Array;
};

export type GetAESKeyProps = {
  privateKey: number[];
  publicKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

export type InputProps = {
  prime: string;
  publicKey: string;
  base: string;
  privateKey: number[];
};

export type EncryptDataProps = { text: string; key: number[] };

export type DecryptDataProps = { text: string; key: number[] };

export interface IEncryptionService {
  encrypt: (input: string) => string;
  decrypt: (input: string) => string;
}

export interface IEncryptionManager {
  createEncryptionService: (options: InputProps) => IEncryptionService;
  getPrivateKey: (options: GetPrivateKeyProps) => number[];
  getPublicKey: (options: GetPublicKeyProps) => number[];
  getAESKey: (options: GetAESKeyProps) => number[];
  encryptData: (options: EncryptDataProps) => string;
  decryptData: (options: DecryptDataProps) => string;
}
