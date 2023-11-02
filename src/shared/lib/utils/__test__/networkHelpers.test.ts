import { executeIfOnline, isAppOnline } from '../networkHelpers';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: async () => ({
    isInternetReachable: true,
    isConnected: true,
  }),
}));

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

describe('Function isAppOnline', () => {
  it('should check if app online', async () => {
    const result = await isAppOnline();

    expect(result).toBe(true);
  });
});

describe('Function executeIfOnline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute function if app is online', async () => {
    const callback = jest.fn();

    jest.mock('../networkHelpers', () => ({
      isAppOnline: jest.fn(async () => new Promise(resolve => resolve(false))),
    }));

    executeIfOnline(callback);

    expect(callback).toBeCalledTimes(0);
  });
});
