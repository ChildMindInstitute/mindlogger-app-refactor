import { Mixpanel } from 'mixpanel-react-native';

import { MixProperties } from './AnalyticsService';
import { APP_VERSION } from '../constants';

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, any>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
  hasInstance(): boolean;
}

class MixpanelAnalytics implements IAnalyticsService {
  private mixpanel: Mixpanel | null;

  constructor(projectToken: string | undefined) {
    if (projectToken?.length) {
      this.mixpanel = new Mixpanel(projectToken, false);
    } else {
      this.mixpanel = null;
    }
  }

  hasInstance(): boolean {
    return !!this.mixpanel;
  }

  init(): Promise<void> {
    return this.mixpanel!.init(undefined, {
      [MixProperties.MindLoggerVersion]: APP_VERSION,
    });
  }

  track(action: string, payload?: Record<string, any> | undefined): void {
    this.mixpanel?.track(action, payload);
  }

  login(id: string): Promise<void> {
    return this.mixpanel!.identify(id).then(() => {
      this.mixpanel?.getPeople()?.set('User ID', id);
    });
  }

  logout(): void {
    this.mixpanel!.reset();
  }
}

export default MixpanelAnalytics;
