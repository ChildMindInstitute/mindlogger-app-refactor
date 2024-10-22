export type PrivateKey = number[];

export interface IUserPrivateKeyRecord {
  get(): PrivateKey | undefined;
  set(privateKey: PrivateKey): void;
  clear(): unknown;
}
