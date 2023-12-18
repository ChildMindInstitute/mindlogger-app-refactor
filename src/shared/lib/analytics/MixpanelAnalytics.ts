import { Mixpanel } from 'mixpanel-react-native';

import { IAnalyticsService } from './AnalyticsService';

class MixpanelAnalytics implements IAnalyticsService {
  private mixpanel: Mixpanel;

  constructor(projectToken: string) {
    this.mixpanel = new Mixpanel(projectToken, false);

    this.mixpanel.init();
  }

  track(action: string, payload?: Record<string, any> | undefined): void {
    this.mixpanel?.track(action, payload);
  }

  login(id: string): Promise<void> {
    return this.mixpanel?.identify(id).then(() => {
      this.mixpanel?.getPeople()?.set('User ID', id);
    });
  }

  logout(): void {
    this.mixpanel?.reset();
  }
}

export default MixpanelAnalytics;
