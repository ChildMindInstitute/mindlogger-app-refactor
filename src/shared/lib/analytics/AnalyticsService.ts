import { MMKV } from 'react-native-mmkv';

import { IAnalyticsService } from './IAnalyticsService';
import { MixpanelAnalytics } from './MixpanelAnalytics';
import { MIXPANEL_TOKEN } from '../constants';
import { ILogger } from '../types/logger';

export class AnalyticsService implements IAnalyticsService {
  private logger: ILogger;
  private analyticsStorage: MMKV;
  private provider: MixpanelAnalytics | undefined;

  constructor(logger: ILogger, analyticsStorage: MMKV) {
    this.logger = logger;
    this.analyticsStorage = analyticsStorage;
    this.provider = undefined;
  }

  async init(): Promise<void> {
    if (this.shouldEnableMixpanel()) {
      if (!this.provider) {
        this.logger.log('[AnalyticsService]: Create MixpanelAnalytics object');
        this.provider = new MixpanelAnalytics(this.getMixpanelToken());
      }
      await this.provider.init();
    }
  }

  track(action: string, payload?: Record<string, unknown>) {
    if (!this.provider) {
      return;
    }

    if (payload) {
      this.logger.log(
        `[AnalyticsService]: Action: ${action}, payload: ${JSON.stringify(
          payload,
        )}`,
      );
    } else {
      this.logger.log('[AnalyticsService]: Action: ' + action);
    }

    this.provider.track(`[Mobile] ${action}`, payload);
  }

  async login(userId: string) {
    if (!this.provider) {
      return;
    }

    if (!this.analyticsStorage.getBoolean('IS_LOGGED_IN')) {
      await this.provider.login(userId);
      this.analyticsStorage.set('IS_LOGGED_IN', true);
    }
  }

  logout() {
    if (!this.provider) {
      return;
    }

    this.track('Logout');
    this.provider.logout();
    this.analyticsStorage.clearAll();
  }

  private shouldEnableMixpanel() {
    return !!MIXPANEL_TOKEN;
  }

  private getMixpanelToken(): string {
    return MIXPANEL_TOKEN as string;
  }
}
