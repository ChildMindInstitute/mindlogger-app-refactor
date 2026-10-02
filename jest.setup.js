import { jest } from '@jest/globals';

jest.mock('@app/shared/lib/storages/mmkvEncryptionKeyManager', () => ({
  initializeStorageEncryption: jest.fn(() => Promise.resolve()),
  getStorageEncryptionConfigSync: jest.fn(() => ({
    encryptionKey: '0123456789abcdef0123456789abcdef',
    encryptionType: 'AES-256',
  })),
}));

jest.mock('@tamagui/animations-moti', () => ({
  createAnimations: jest.fn(() => undefined),
}));

jest.mock('moti', () => {
  const { View } = require('react-native');

  return {
    MotiView: props => <View {...props} />,
  };
});
