import { Mixpanel } from 'mixpanel-react-native';

import { IAnalyticsService, MixProperties } from './IAnalyticsService';
import { APP_VERSION } from '../constants';

export class MixpanelAnalytics implements IAnalyticsService {
  private mixpanel: Mixpanel;

  constructor(projectToken: string) {
    const MixpanelClient = this.getMixpanelClientClass();
    this.mixpanel = new MixpanelClient(projectToken, false);
  }

  async init(): Promise<void> {
    await this.mixpanel.init(undefined, {
      [MixProperties.MindLoggerVersion]: this.getAppVersion(),
    });
  }

  track(action: string, payload?: Record<string, unknown> | undefined): void {
    this.mixpanel.track(action, payload);
  }

  async login(id: string): Promise<void> {
    await this.mixpanel.identify(id);
    this.mixpanel.getPeople().set('User ID', id);
  }

  logout(): void {
    this.mixpanel.reset();
  }

  private getMixpanelClientClass() {
    return Mixpanel;
  }

  private getAppVersion() {
    return APP_VERSION;
  }
}
