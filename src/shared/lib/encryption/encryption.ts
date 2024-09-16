import { Buffer } from 'buffer';

import { IV_LENGTH } from '@shared/lib';

import { crypto } from './crypto';

type GetPrivateKeyProps = { userId: string; email: string; password: string };
type GetPublicKeyProps = {
  privateKey: number[];
  appletPrime: string;
  appletBase: string;
};

type GetAESKeyProps = {
  privateKey: number[];
  publicKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

type InputProps = {
  prime: string;
  publicKey: string;
  base: string;
  privateKey: number[];
};

type EncryptDataProps = { text: string; key: number[] };
type DecryptDataProps = { text: string; key: number[] };

class EncryptionManager {
  private getRandomBytes(): Buffer {
    return crypto.randomBytes(Number(IV_LENGTH));
  }

  public createEncryptionService = (params: InputProps) => {
    const aesKey = this.getAESKey({
      appletPrime: JSON.parse(params.prime),
      appletBase: JSON.parse(params.base),
      publicKey: JSON.parse(params.publicKey),
      privateKey: params.privateKey,
    });

    const encrypt = (json: string) => {
      return this.encryptData({
        text: json,
        key: aesKey,
      });
    };

    const decrypt = (json: string) => {
      return this.decryptData({
        text: json,
        key: aesKey,
      });
    };

    return { encrypt, decrypt };
  };

  public getPrivateKey = ({
    userId,
    email,
    password,
  }: GetPrivateKeyProps): number[] => {
    const leftPart = crypto
      .createHash('sha512')
      .update(password + email)
      .digest();
    const rightPart = crypto
      .createHash('sha512')
      .update(userId + email)
      .digest();

    return Array.from(
      Buffer.concat([Buffer.from(leftPart), Buffer.from(rightPart)]),
    );
  };

  public getPublicKey = ({
    appletPrime,
    appletBase,
    privateKey,
  }: GetPublicKeyProps): number[] => {
    const key = crypto.createDiffieHellman(
      Buffer.from(appletPrime),
      Buffer.from(appletBase),
    );
    key.setPrivateKey(Buffer.from(privateKey));
    key.generateKeys();

    return Array.from(key.getPublicKey());
  };

  public getAESKey = ({
    privateKey,
    publicKey,
    appletPrime,
    appletBase,
  }: GetAESKeyProps): number[] => {
    const key = crypto.createDiffieHellman(
      Buffer.from(appletPrime),
      Buffer.from(appletBase),
    );
    key.setPrivateKey(Buffer.from(privateKey));

    const secretKey = key.computeSecret(Buffer.from(publicKey));

    return Array.from(crypto.createHash('sha256').update(secretKey).digest());
  };

  public encryptData = ({ text, key }: EncryptDataProps): string => {
    const CHUNK_SIZE = 10240;
    const iv: Buffer = this.getRandomBytes();
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

    const encryptedChunks: Buffer[] = [];

    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      const chunk = text.slice(i, i + CHUNK_SIZE);
      encryptedChunks.push(cipher.update(chunk));
    }

    encryptedChunks.push(cipher.final());

    const encrypted = Buffer.concat(encryptedChunks);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  };

  public decryptData = ({ text, key }: DecryptDataProps): string => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key),
      iv,
    );
    const decrypted = decipher.update(encryptedText);

    try {
      return decrypted.toString() + decipher.final('utf8');
    } catch (error) {
      console.error(
        'Decrypt data failed. Text:',
        text,
        'key:',
        key,
        'error:',
        error,
      );

      return JSON.stringify([{ type: '', time: '', screen: '' }]);
    }
  };
}

export const encryption = new EncryptionManager();
