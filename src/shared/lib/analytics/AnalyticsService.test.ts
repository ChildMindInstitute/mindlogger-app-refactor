const constructorMock = jest.fn();
const initMock = jest.fn();
const trackMock = jest.fn();
const identifyMock = jest.fn().mockResolvedValue(0);
const resetMock = jest.fn();

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

  public reset() {
    resetMock();
  }
}

jest.mock('mixpanel-react-native', () => ({
  Mixpanel: MixpanelMockClass,
}));

const MOCK_MIXPANEL_TOKEN: string | undefined = 'MOCK_MIXPANEL_TOKEN_123';

const MOCK_APP_VERSION = 'MOCK_APP_VERSION_456';

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
const clearAllMock = jest.fn();

jest.mock('../storages', () => ({
  createStorage: jest.fn().mockReturnValue({
    getBoolean: jest.fn().mockReturnValue(false),
    set: storageSetMock,
    clearAll: clearAllMock,
  }),
}));

import { AnalyticsService, MixEvents, MixProperties } from './AnalyticsService';

describe('Test AnalyticsService and MixpanelAnalytics', () => {
  beforeAll(() => {
    AnalyticsService.shouldEnableMixpanel = jest.fn().mockReturnValue(true);
  });

  beforeEach(() => {
    constructorMock.mockReset();
    initMock.mockReset();
    identifyMock.mockReset().mockResolvedValue(0);
    trackMock.mockReset();
    storageSetMock.mockReset();
    resetMock.mockReset();
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

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(storageSetMock).toHaveBeenCalledTimes(1);
    expect(storageSetMock).toHaveBeenCalledWith('IS_LOGGED_IN', true);
  });

  it('Should track without params', async () => {
    await AnalyticsService.init();

    await AnalyticsService.track(MixEvents.AssessmentStarted);

    expect(trackMock).toBeCalledTimes(1);
    expect(trackMock).toBeCalledWith([
      '[Mobile] Assessment started',
      undefined,
    ]);
  });

  it('Should track with two params', async () => {
    await AnalyticsService.init();

    await AnalyticsService.track(MixEvents.AssessmentStarted, {
      [MixProperties.AppletId]: 'mock-applet-id',
      [MixProperties.MindLoggerVersion]: 'mock-version',
    });

    expect(trackMock).toBeCalledTimes(1);
    expect(trackMock).toBeCalledWith([
      '[Mobile] Assessment started',
      { 'Applet ID': 'mock-applet-id', 'MindLogger Version': 'mock-version' },
    ]);
  });

  it('Should logout', async () => {
    await AnalyticsService.init();

    await AnalyticsService.logout();

    expect(trackMock).toBeCalledTimes(1);
    expect(trackMock).toBeCalledWith(['[Mobile] Logout', undefined]);

    expect(resetMock).toBeCalledTimes(1);
    expect(clearAllMock).toBeCalledTimes(1);
  });
});

describe('Test AnalyticsService and MixpanelAnalytics when Mixpanel instance is not created', () => {
  beforeAll(() => {
    AnalyticsService.shouldEnableMixpanel = jest.fn().mockReturnValue(false);
  });

  beforeEach(() => {
    constructorMock.mockReset();
    initMock.mockReset();
    identifyMock.mockReset().mockResolvedValue(0);
    trackMock.mockReset();
    storageSetMock.mockReset();
    resetMock.mockReset();
  });

  it('Should not login', async () => {
    await AnalyticsService.login('mock-user-id');

    expect(identifyMock).toHaveBeenCalledTimes(0);
  });

  it('Should not track', async () => {
    await AnalyticsService.track(MixEvents.AssessmentStarted);

    expect(trackMock).toBeCalledTimes(0);
  });

  it('Should not logout', async () => {
    await AnalyticsService.logout();

    expect(trackMock).toBeCalledTimes(0);
    expect(resetMock).toBeCalledTimes(0);
  });
});
