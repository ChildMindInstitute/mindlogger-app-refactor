const constructorMock = jest.fn();
const initMock = jest.fn();
const identifyMock = jest.fn().mockResolvedValue(0);
const boolVariationMock = jest.fn().mockResolvedValue(true);
const onMock = jest.fn();

class LaunchDarklyMockClass {
  constructor(...args: unknown[]) {
    constructorMock(args);
  }

  public init(...args: unknown[]) {
    initMock(args);
  }

  public identify(...args: unknown[]) {
    return identifyMock(args);
  }

  public boolVariation(...args: unknown[]) {
    return boolVariationMock(args);
  }

  public on(...args: unknown[]) {
    onMock(args);
  }
}

enum AutoEnvAttributesMock {
  Disabled = 0,
  Enabled = 1,
}

jest.mock('@launchdarkly/react-native-client-sdk', () => ({
  ReactNativeLDClient: LaunchDarklyMockClass,
  AutoEnvAttributes: AutoEnvAttributesMock,
}));

const MOCK_LD_CLIENT_ID: string | undefined = 'MOCK_LD_CLIENT_ID_123';

jest.mock('../constants', () => ({
  LAUNCHDARKLY_MOBILE_KEY: MOCK_LD_CLIENT_ID,
}));

jest.mock('../services', () => ({
  Logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

import { LD_KIND_PREFIX } from './FeatureFlags.const';
import { FeatureFlagsService } from './FeatureFlagsService';

describe('Test FeatureFlagsService', () => {
  beforeAll(() => {
    FeatureFlagsService.init();
  });

  beforeEach(() => {
    constructorMock.mockReset();
    initMock.mockReset();
    identifyMock.mockReset().mockResolvedValue(0);
    boolVariationMock.mockReset().mockResolvedValue(true);
    onMock.mockReset();
  });

  it('Should pass LAUNCHDARKLY_MOBILE_KEY into constructor of LaunchDarkly class', async () => {
    FeatureFlagsService.init();

    expect(constructorMock).toHaveBeenCalledTimes(1);
    expect(constructorMock).toHaveBeenCalledWith([
      MOCK_LD_CLIENT_ID,
      AutoEnvAttributesMock.Disabled,
      {},
    ]);
  });

  it('Should login', async () => {
    await FeatureFlagsService.login('mock-user-id');

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(identifyMock).toHaveBeenCalledWith([
      {
        kind: LD_KIND_PREFIX,
        key: `${LD_KIND_PREFIX}-mock-user-id`,
      },
    ]);
  });

  it('Should logout', async () => {
    FeatureFlagsService.logout();

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(identifyMock).toHaveBeenCalledWith([
      {
        anonymous: true,
        key: '',
        kind: 'user',
      },
    ]);
  });

  it('Should resolve boolean', async () => {
    // await required for mockResolvedValue Promise
    const flagValue = await FeatureFlagsService.evaluateFlag('my-flag');

    expect(boolVariationMock).toHaveBeenCalledTimes(1);
    expect(boolVariationMock).toHaveBeenCalledWith(['my-flag', false]);
    expect(flagValue).toBe(true);
  });

  it('Should set onChange handler', async () => {
    const changeHandler = jest.fn();
    FeatureFlagsService.setChangeHandler(changeHandler);

    expect(onMock).toHaveBeenCalledTimes(1);
    expect(onMock).toHaveBeenCalledWith(['change', changeHandler]);
  });
});
