const constructorMock = jest.fn();
const initMock = jest.fn();
const trackMock = jest.fn();
const identifyMock = jest.fn().mockResolvedValue(0);

export class MixpanelMockClass {
  constructor(...args: any) {
    constructorMock(args);
  }

  public init(...args: any[]) {
    initMock(args);
  }

  public track(...args: any[]) {
    trackMock(args);
  }

  public identify(...args: any[]) {
    return identifyMock(args);
  }

  public getPeople() {
    return { set: jest.fn() };
  }
}

jest.mock('mixpanel-react-native', () => ({
  Mixpanel: MixpanelMockClass,
}));

const MOCK_MIXPANEL_TOKEN = 'MOCK_MIXPANEL_TOKEN_100500';

const MOCK_APP_VERSION = 'MOCK_APP_VERSION_200800';

jest.mock('../constants', () => ({
  MIXPANEL_TOKEN: MOCK_MIXPANEL_TOKEN,
  APP_VERSION: MOCK_APP_VERSION,
}));

jest.mock('../services', () => ({
  Logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const storageSetMock = jest.fn();

jest.mock('../storages', () => ({
  createStorage: jest.fn().mockReturnValue({
    getBoolean: jest.fn().mockReturnValue(false),
    set: storageSetMock,
  }),
}));

import AnalyticsService from './AnalyticsService';

describe('Test AnalyticsService and MixpanelAnalytics', () => {
  beforeEach(() => {
    constructorMock.mockReset();
    initMock.mockReset();
    trackMock.mockReset();
    storageSetMock.mockReset();
  });

  it('Should pass MIXPANEL_TOKEN into constructor of Mixpanel class', async () => {
    await AnalyticsService.init();

    expect(constructorMock).toHaveBeenCalledTimes(1);
    expect(constructorMock).toHaveBeenCalledWith([MOCK_MIXPANEL_TOKEN, false]);
  });

  it('Should pass APP_VERSION into init of Mixpanel instance', async () => {
    await AnalyticsService.init();

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock).toHaveBeenCalledWith([
      undefined,
      { 'MindLogger Version': `${MOCK_APP_VERSION}` },
    ]);
  });

  it('Should login', async () => {
    await AnalyticsService.init();

    await AnalyticsService.login('mock-user-id');

    expect(storageSetMock).toHaveBeenCalledTimes(1);
    expect(storageSetMock).toHaveBeenCalledWith('IS_LOGGED_IN', true);
  });
});
