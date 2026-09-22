import { ReactNativeLDClient } from '@launchdarkly/react-native-client-sdk';

import { LD_KIND_PREFIX } from './FeatureFlags.const';
import { FeatureFlagsService } from './FeatureFlagsService';
import { getDefaultFeatureFlagsService } from './featureFlagsServiceInstance';
import { IFeatureFlagsService } from './IFeatureFlagsService';
import { ILogger } from '../types/logger';

class TestLaunchDarklyClient {
  static constructorSpy: jest.Mock;

  constructor(...args: unknown[]) {
    if (TestLaunchDarklyClient.constructorSpy) {
      TestLaunchDarklyClient.constructorSpy(...args);
    }
  }

  init() {}
  identify() {}
  boolVariation() {}
  jsonVariation() {}
  on() {}
}

type TestFeatureFlagsService = IFeatureFlagsService & {
  logger: ILogger;
  client: ReactNativeLDClient;
  getLaunchDarklyClientClass: FeatureFlagsService['getLaunchDarklyClientClass'];
  getLaunchDarklyMobileKey: FeatureFlagsService['getLaunchDarklyMobileKey'];
};

const MOCK_LD_CLIENT_ID: string | undefined = 'MOCK_LD_CLIENT_ID_123';

describe('Test FeatureFlagsService', () => {
  let service: TestFeatureFlagsService;

  beforeEach(() => {
    TestLaunchDarklyClient.constructorSpy = jest.fn();

    service =
      getDefaultFeatureFlagsService() as never as TestFeatureFlagsService;

    jest.spyOn(service.logger, 'log').mockReturnValue(undefined);

    jest
      .spyOn(service, 'getLaunchDarklyClientClass')
      .mockReturnValue(TestLaunchDarklyClient as never);

    jest
      .spyOn(service, 'getLaunchDarklyMobileKey')
      .mockReturnValue(MOCK_LD_CLIENT_ID);
  });

  it('Should pass LAUNCHDARKLY_MOBILE_KEY into constructor of LaunchDarkly class', async () => {
    service.init();

    expect(TestLaunchDarklyClient.constructorSpy).toHaveBeenCalledTimes(1);

    expect(TestLaunchDarklyClient.constructorSpy).toHaveBeenCalledWith(
      MOCK_LD_CLIENT_ID,
      0,
      {},
    );
  });

  it('Should login', async () => {
    const identifySpy = jest.spyOn(service.client, 'identify');

    await service.login('mock-user-id');

    expect(identifySpy).toHaveBeenCalledTimes(1);
    expect(identifySpy).toHaveBeenCalledWith({
      kind: LD_KIND_PREFIX,
      key: `${LD_KIND_PREFIX}-mock-user-id`,
    });
  });

  it('Should logout', async () => {
    const identifySpy = jest.spyOn(service.client, 'identify');

    await service.logout();

    expect(identifySpy).toHaveBeenCalledTimes(1);
    expect(identifySpy).toHaveBeenCalledWith({
      anonymous: true,
      key: '',
      kind: 'user',
    });
  });

  it('Should resolve boolean', () => {
    const boolVariationSpy = jest
      .spyOn(service.client, 'boolVariation')
      .mockReturnValue(true);

    const flagValue = service.evaluateFlag('my-flag');

    expect(flagValue).toBe(true);

    expect(boolVariationSpy).toHaveBeenCalledTimes(1);
    expect(boolVariationSpy).toHaveBeenCalledWith('my-flag', false);
  });

  it('Should resolve string array', () => {
    const jsonVariationSpy = jest
      .spyOn(service.client, 'jsonVariation')
      .mockReturnValue(['applet-1', 'applet-2']);

    const flagValue = service.evaluateStringArrayFlag('hide-data-tab-applets');

    expect(flagValue).toEqual(['applet-1', 'applet-2']);

    expect(jsonVariationSpy).toHaveBeenCalledTimes(1);
    expect(jsonVariationSpy).toHaveBeenCalledWith('hide-data-tab-applets', []);
  });

  it('Should fall back to the default when the flag value is not an array', () => {
    jest.spyOn(service.client, 'jsonVariation').mockReturnValue(true);

    expect(service.evaluateStringArrayFlag('hide-data-tab-applets')).toEqual(
      [],
    );
  });

  it('Should drop non-string entries from the flag value', () => {
    jest
      .spyOn(service.client, 'jsonVariation')
      .mockReturnValue(['applet-1', 1, null, 'applet-2']);

    expect(service.evaluateStringArrayFlag('hide-data-tab-applets')).toEqual([
      'applet-1',
      'applet-2',
    ]);
  });

  it('Should set onChange handler', () => {
    const onSpy = jest.spyOn(service.client, 'on');
    const changeHandler = jest.fn();

    service.setChangeHandler(changeHandler);

    expect(onSpy).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledWith('change', changeHandler);
  });
});
