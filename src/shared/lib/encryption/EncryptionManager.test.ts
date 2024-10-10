import { EncryptionManager } from './EncryptionManager';
import { getDefaultEncryptionManager } from './encryptionManagerInstance';
import { IEncryptionManager } from './IEncryptionManager';
import { answerRequestExample } from './mockData';
import { crypto } from './crypto'; 

type TestEncryptionManager = IEncryptionManager & {
  getRandomBytes: EncryptionManager['getRandomBytes'];
};

describe('Encryption', () => {
  let encryptionManager: TestEncryptionManager;

  let privateKey: number[];
  let publicKey: number[];
  let appletPrime: number[];
  let appletBase: number[];

  beforeEach(() => {
    encryptionManager =
      getDefaultEncryptionManager() as never as TestEncryptionManager;

    jest
      .spyOn(encryptionManager, 'getRandomBytes')
      .mockReturnValue(Buffer.alloc(16, 'Mock generate string'));

    const dh = crypto.createDiffieHellman(2048);
    dh.generateKeys();

    appletPrime = Array.from(dh.getPrime());
    appletBase = Array.from(dh.getGenerator());
    privateKey = Array.from(dh.getPrivateKey());
    publicKey = Array.from(dh.getPublicKey());
  });

  describe('getPrivateKey', () => {
    it('should return a valid private key', () => {
      const userId = '123';
      const email = 'test@example.com';
      const password = 'password123';

      const generatedPrivateKey = encryptionManager.getPrivateKey({
        userId,
        email,
        password,
      });

      expect(Array.isArray(generatedPrivateKey)).toBe(true);
      expect(generatedPrivateKey.every(num => typeof num === 'number')).toBe(
        true,
      );
    });
  });

  describe('getPublicKey', () => {
    it('should return a valid public key', () => {
      const generatedPublicKey = encryptionManager.getPublicKey({
        appletPrime,
        appletBase,
        privateKey,
      });
  
      expect(Array.isArray(generatedPublicKey)).toBe(true);
      expect(generatedPublicKey.every(num => typeof num === 'number')).toBe(true);
      expect(generatedPublicKey.length).toBeGreaterThan(0);
    });
  });
  

  describe('getAESKey', () => {
    it('should return a valid AES key', () => {
      const aesKey = encryptionManager.getAESKey({
        privateKey,
        publicKey,
        appletPrime,
        appletBase,
      });

      expect(Array.isArray(aesKey)).toBe(true);
      expect(aesKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('encryptData', () => {
    it('should return an encrypted string', () => {
      const text = 'Hello, world!';
  
      const aesKey = encryptionManager.getAESKey({
        privateKey,
        publicKey,
        appletPrime,
        appletBase,
      });
  
      const encryptedText = encryptionManager.encryptData({
        text,
        key: aesKey,
      });
  
      expect(typeof encryptedText).toBe('string');
      expect(encryptedText.length).toBeGreaterThan(0);
    });
  });

  describe('decryptData', () => {
    it('should return the decrypted text', () => {
      const text = 'Hello, world!';
  
      const aesKey = encryptionManager.getAESKey({
        privateKey,
        publicKey,
        appletPrime,
        appletBase,
      });
  
      const encryptedText = encryptionManager.encryptData({
        text,
        key: aesKey,
      });
  
      const decryptedText = encryptionManager.decryptData({
        text: encryptedText,
        key: aesKey,
      });
  
      expect(decryptedText).toBe(text);
    });
  });

  describe('getPrivateKey', () => {
    it('should return the private key', () => {
      const userParams = {
        email: 'linuxweeva@gmail.com',
        password: 'Scope;09',
        userId: '2923f4a9-20ef-4995-a340-251d96ff3082',
      };
  
      const generatedPrivateKey = encryptionManager.getPrivateKey(userParams);
  
      const expectedPrivateKey = encryptionManager.getPrivateKey(userParams);
  
      expect(generatedPrivateKey).toStrictEqual(expectedPrivateKey);
    });
  });
  

  describe('encrypt AnswerRequest', () => {
    it('should return an encrypted string of real answer request', () => {
      const text = JSON.stringify(answerRequestExample);
  
      const aesKey = encryptionManager.getAESKey({
        privateKey,
        publicKey,
        appletPrime,
        appletBase,
      });
  
      const encryptedText = encryptionManager.encryptData({
        text,
        key: aesKey,
      });
  
      const decryptedText = encryptionManager.decryptData({
        text: encryptedText,
        key: aesKey,
      });
  
      expect(typeof encryptedText).toBe('string');
      expect(decryptedText).toEqual(text);
      expect(encryptedText.length).toBeGreaterThan(0);
    });
  });

  describe('decrypt AnswerRequest', () => {
    it('should return the decrypted answer Request', () => {
      const originalText = JSON.stringify(answerRequestExample);
  
      const aesKey = encryptionManager.getAESKey({
        privateKey,
        publicKey,
        appletPrime,
        appletBase,
      });
  
      const encryptedText = encryptionManager.encryptData({
        text: originalText,
        key: aesKey,
      });
  
      const decryptedText = encryptionManager.decryptData({
        text: encryptedText,
        key: aesKey,
      });
  
      expect(decryptedText).toBe(originalText);
    });
  });
});
