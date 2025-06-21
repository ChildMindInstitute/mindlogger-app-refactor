import { jest } from '@jest/globals';

import { StorageInstanceManager } from '@app/shared/lib/storages/StorageInstanceManager';

jest.mock('@tamagui/animations-moti', () => ({
  createAnimations: jest.fn(() => undefined),
}));

jest.mock('moti', () => {
  const { View } = require('react-native');

  return {
    MotiView: props => <View {...props} />,
  };
});

global.beforeEach(() => {
  jest
    .spyOn(StorageInstanceManager.prototype, 'getStoreEncryptionKey')
    .mockReturnValue('12345');
});
