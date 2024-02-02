import MixpanelAnalytics from './MixpanelAnalytics';
import { ENV, MIXPANEL_TOKEN } from '../constants';
import { Logger } from '../services';
import { createStorage } from '../storages';

const isProduction = !ENV;
const shouldEnableMixpanel = MIXPANEL_TOKEN && isProduction;

export const storage = createStorage('analytics-storage');

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, any>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
}

let service: IAnalyticsService;

export const MixProperties = {
  AppletId: 'Applet ID',
};

export const MixEvents = {
  DataView: 'Data View',
  AppletView: 'Applet View',
  HomeView: 'Home Page View',
  AssessmentStarted: "'Assessment started'",
  RetryButtonPressed: 'Retry button pressed',
  LoginSuccessful: 'Login Successful',
  SignupSuccessful: 'Signup Successful',
  AppOpen: 'App Open',
  ActivityRestart: 'Activity Restart Button Pressed',
  ActivityResume: 'Activity Resume Button Pressed',
  AppletSelected: 'Applet Selected',
};

const AnalyticsService = {
  async init(): Promise<void> {
    if (shouldEnableMixpanel && MIXPANEL_TOKEN) {
      service = new MixpanelAnalytics(MIXPANEL_TOKEN);
      return service.init();
    }
  },
  track(action: string, payload?: Record<string, any>) {
    if (payload) {
      Logger.log(
        `[AnalyticsService]: Action: ${action}, payload: ${JSON.stringify(
          payload,
        )}`,
      );
    } else {
      Logger.log('[AnalyticsService]: Action: ' + action);
    }

    if (shouldEnableMixpanel) {
      service.track(`[Mobile] ${action}`, payload);
    }
  },
  async login(userId: string) {
    const isLoggedIn = storage.getBoolean('IS_LOGGED_IN');

    if (shouldEnableMixpanel && !isLoggedIn) {
      return service.login(userId).then(() => {
        storage.set('IS_LOGGED_IN', true);
      });
    }
  },
  logout() {
    if (shouldEnableMixpanel) {
      this.track('Logout');
      service.logout();
      storage.clearAll();
    }
  },
};

export default AnalyticsService;
