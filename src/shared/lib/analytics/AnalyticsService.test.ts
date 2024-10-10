import { MMKV } from 'react-native-mmkv';

import { AnalyticsService } from './AnalyticsService';
import { getDefaultAnalyticsService } from './analyticsServiceInstance';
import {
  IAnalyticsService,
  MixEvents,
  MixProperties,
} from './IAnalyticsService';
import { MixpanelAnalytics } from './MixpanelAnalytics';
import { ILogger } from '../types/logger';

class TestMixpanelClient {
  static constructorSpy: jest.Mock;
  static initSpy: jest.Mock;
  static identifySpy: jest.Mock;
  static trackSpy: jest.Mock;
  static resetSpy: jest.Mock;

  constructor(...args: unknown[]) {
    if (TestMixpanelClient.constructorSpy) {
      TestMixpanelClient.constructorSpy(...args);
    }
  }

  init(...args: unknown[]) {
    if (TestMixpanelClient.initSpy) {
      TestMixpanelClient.initSpy(...args);
    }
  }

  identify(...args: unknown[]) {
    if (TestMixpanelClient.identifySpy) {
      TestMixpanelClient.identifySpy(...args);
    }
  }

  track(...args: unknown[]) {
    if (TestMixpanelClient.trackSpy) {
      TestMixpanelClient.trackSpy(...args);
    }
  }

  getPeople() {
    return {
      set: () => {},
    };
  }

  reset(...args: unknown[]) {
    if (TestMixpanelClient.resetSpy) {
      TestMixpanelClient.resetSpy(...args);
    }
  }
}

type TestAnalyticsService = IAnalyticsService & {
  logger: ILogger;
  provider: MixpanelAnalytics | undefined;
  analyticsStorage: MMKV;
  shouldEnableMixpanel: AnalyticsService['shouldEnableMixpanel'];
  getMixpanelToken: AnalyticsService['getMixpanelToken'];
};

const MOCK_MIXPANEL_TOKEN: string | undefined = 'MOCK_MIXPANEL_TOKEN_123';
const MOCK_APP_VERSION = 'MOCK_APP_VERSION_456';

describe('Test AnalyticsService and MixpanelAnalytics', () => {
  let service: TestAnalyticsService;

  beforeEach(() => {
    TestMixpanelClient.constructorSpy = jest.fn();
    TestMixpanelClient.initSpy = jest.fn();
    TestMixpanelClient.identifySpy = jest.fn();
    TestMixpanelClient.trackSpy = jest.fn();
    TestMixpanelClient.resetSpy = jest.fn();

    jest
      .spyOn(MixpanelAnalytics.prototype as never, 'getMixpanelClientClass')
      .mockReturnValue(TestMixpanelClient as never);

    jest
      .spyOn(MixpanelAnalytics.prototype as never, 'getAppVersion')
      .mockReturnValue(MOCK_APP_VERSION as never);

    service = getDefaultAnalyticsService() as never as TestAnalyticsService;
    service.provider = undefined;

    jest.spyOn(service, 'shouldEnableMixpanel').mockReturnValue(true);

    jest
      .spyOn(service, 'getMixpanelToken')
      .mockReturnValue(MOCK_MIXPANEL_TOKEN);

    jest.spyOn(service.logger, 'log').mockReturnValue(undefined);
  });

  it('Should pass MIXPANEL_TOKEN into constructor of Mixpanel class', async () => {
    await service.init();

    expect(TestMixpanelClient.constructorSpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.constructorSpy).toHaveBeenCalledWith(
      MOCK_MIXPANEL_TOKEN,
      false,
    );
  });

  it('Should pass APP_VERSION into init of Mixpanel instance', async () => {
    await service.init();

    expect(TestMixpanelClient.initSpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.initSpy).toHaveBeenCalledWith(undefined, {
      'MindLogger Version': MOCK_APP_VERSION,
    });
  });

  it('Should login', async () => {
    const setSpy = jest.spyOn(service.analyticsStorage, 'set');

    await service.init();

    await service.login('mock-user-id');

    expect(TestMixpanelClient.identifySpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.identifySpy).toHaveBeenCalledWith('mock-user-id');
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith('IS_LOGGED_IN', true);
  });

  it('Should track without params', async () => {
    await service.init();

    service.track(MixEvents.AssessmentStarted);

    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledWith(
      '[Mobile] Assessment started',
      undefined,
    );
  });

  it('Should track with two params', async () => {
    await service.init();

    service.track(MixEvents.AssessmentStarted, {
      [MixProperties.AppletId]: 'mock-applet-id',
      [MixProperties.MindLoggerVersion]: 'mock-version',
    });

    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledWith(
      '[Mobile] Assessment started',
      { 'Applet ID': 'mock-applet-id', 'MindLogger Version': 'mock-version' },
    );
  });

  it('Should logout', async () => {
    const clearAllSpy = jest.spyOn(service.analyticsStorage, 'clearAll');

    await service.init();

    service.logout();

    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(1);
    expect(TestMixpanelClient.trackSpy).toHaveBeenCalledWith(
      '[Mobile] Logout',
      undefined,
    );

    expect(TestMixpanelClient.resetSpy).toHaveBeenCalledTimes(1);
    expect(clearAllSpy).toHaveBeenCalledTimes(1);
  });

  describe('when Mixpanel instance is not created', () => {
    beforeEach(() => {
      jest.spyOn(service, 'shouldEnableMixpanel').mockReturnValue(false);
    });

    it('Should not login', async () => {
      await service.init();

      await service.login('mock-user-id');

      expect(TestMixpanelClient.identifySpy).toHaveBeenCalledTimes(0);
    });

    it('Should not track', async () => {
      await service.init();

      service.track(MixEvents.AssessmentStarted);

      expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(0);
    });

    it('Should not logout', async () => {
      await service.init();

      service.logout();

      expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(0);
      expect(TestMixpanelClient.trackSpy).toHaveBeenCalledTimes(0);
    });
  });
});
