import MixpanelAnalytics from './MixpanelAnalytics';
import { ENV, MIXPANEL_TOKEN } from '../constants';
import { createStorage } from '../storages';

const isProduction = !ENV;
const shouldEnableMixpanel = MIXPANEL_TOKEN && isProduction;

export const storage = createStorage('analytics-storage');

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, any>): void;
  setAttribute(key: string, value: string): void;
  login(id: string): Promise<void>;
  logout(): void;
}

let service: IAnalyticsService;

const AnalyticsService = {
  init() {
    if (shouldEnableMixpanel && MIXPANEL_TOKEN) {
      service = new MixpanelAnalytics(MIXPANEL_TOKEN);
    }
  },
  track(action: string, payload?: Record<string, any>) {
    if (shouldEnableMixpanel) {
      service.track(`[Mobile] ${action}`, payload);
    }
  },
  setAttribute(key: string, value: string) {
    if (shouldEnableMixpanel) {
      service.setAttribute(key, value);
    }
  },
  async login(userId: string) {
    const isLoggedIn = storage.getBoolean('IS_LOGGED_IN');

    if (shouldEnableMixpanel && !isLoggedIn) {
      return service.login(userId).then(() => {
        storage.set('IS_LOGGED_IN', true);
        service.setAttribute('User ID', userId);
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
