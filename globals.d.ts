type TimeoutId = ReturnType<typeof setTimeout>;

type IntervalId = ReturnType<typeof setInterval>;

type Maybe<TValue> = TValue | null | undefined;

declare module 'react-native-crypto' {
  import { BinaryLike } from 'crypto';

  export interface Hash {
    update(data: BinaryLike): this;
    digest(encoding?: 'hex' | 'base64' | 'latin1'): string | Buffer;
  }

  export interface Cipher {
    update(
      data: BinaryLike,
      inputEncoding?: 'utf8' | 'ascii' | 'latin1',
    ): Buffer;
    final(): Buffer;
  }

  export interface Decipher {
    update(data: Buffer, inputEncoding?: 'utf8' | 'ascii' | 'latin1'): Buffer;
    final(encoding?: 'utf8' | 'ascii' | 'latin1'): Buffer | string;
  }

  export function createHash(algorithm: 'sha256' | 'sha512' | string): Hash;
  export function createCipheriv(
    algorithm: string,
    key: Buffer,
    iv: Buffer,
  ): Cipher;
  export function createDecipheriv(
    algorithm: string,
    key: Buffer,
    iv: Buffer,
  ): Decipher;
  export function randomBytes(size: number): Buffer;
  export function createDiffieHellman(prime: Buffer, generator: Buffer): any;
}
