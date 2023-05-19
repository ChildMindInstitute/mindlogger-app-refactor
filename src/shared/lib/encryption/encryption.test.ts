import { encryption } from './encryption';

describe('Encryption', () => {
  describe('getPrivateKey', () => {
    it('should return a valid private key', () => {
      const userId = '123';
      const email = 'test@example.com';
      const password = 'password123';

      const privateKey = encryption.getPrivateKey({ userId, email, password });

      // Assert that the private key is an array of numbers
      expect(Array.isArray(privateKey)).toBe(true);
      expect(privateKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('getPublicKey', () => {
    it('should return a valid public key', () => {
      const appletPrime = [1, 2, 3];
      const appletBase = [4, 5, 6];
      const privateKey = [7, 8, 9];

      const publicKey = encryption.getPublicKey({
        appletPrime,
        appletBase,
        privateKey,
      });

      // Assert that the public key is an array of numbers
      expect(Array.isArray(publicKey)).toBe(true);
      expect(publicKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('getAESKey', () => {
    it('should return a valid AES key', () => {
      const userPrivateKey = [1, 2, 3];
      const appletPublicKey = [4, 5, 6];
      const appletPrime = [7, 8, 9];
      const appletBase = [10, 11, 12];

      const aesKey = encryption.getAESKey({
        userPrivateKey,
        appletPublicKey,
        appletPrime,
        appletBase,
      });

      // Assert that the AES key is an array of numbers
      expect(Array.isArray(aesKey)).toBe(true);
      expect(aesKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('encryptData', () => {
    it('should return an encrypted string', () => {
      const text = 'Hello, world!';
      const key = [1, 2, 3, 4, 5, 6, 7, 8];

      const encryptedText = encryption.encryptData({ text, key });

      // Assert that the encrypted text is a non-empty string
      expect(typeof encryptedText).toBe('string');
      expect(encryptedText.length).toBeGreaterThan(0);
    });
  });

  describe('decryptData', () => {
    it('should return the decrypted text', () => {
      const encryptedText = '1234567890abcdef:fedcba0987654321';
      const key = '0123456789abcdef';

      // @ts-ignore
      const decryptedText = encryption.decryptData({ encryptedText, key });

      // Assert that the decrypted text matches the original text
      expect(decryptedText).toBe('Hello, world!');
    });
  });

  describe('getPrivateKey', () => {
    it('should return the private key', () => {
      const result = [
        119, 246, 61, 4, 69, 250, 117, 76, 124, 94, 83, 227, 223, 184, 230, 126,
        252, 194, 122, 167, 138, 161, 129, 226, 125, 229, 100, 32, 41, 219, 255,
        183, 193, 232, 127, 139, 132, 37, 7, 138, 162, 69, 59, 54, 31, 108, 146,
        220, 103, 194, 154, 35, 179, 57, 97, 219, 210, 141, 118, 82, 66, 131,
        194, 237, 14, 117, 143, 233, 157, 169, 111, 173, 6, 235, 26, 233, 23,
        248, 138, 49, 100, 206, 165, 177, 151, 205, 97, 103, 85, 41, 181, 124,
        102, 136, 159, 89, 204, 213, 232, 28, 154, 3, 10, 31, 140, 201, 135, 91,
        2, 129, 40, 210, 175, 162, 44, 241, 89, 178, 78, 98, 148, 11, 241, 144,
        227, 216, 75, 249,
      ];
      const userParams = {
        email: 'linuxweeva@gmail.com',
        password: 'Scope;09',
        userId: '2923f4a9-20ef-4995-a340-251d96ff3082',
      };

      const privateKey = encryption.getPrivateKey(userParams);

      expect(privateKey).toBe(result);
    });
  });
});
