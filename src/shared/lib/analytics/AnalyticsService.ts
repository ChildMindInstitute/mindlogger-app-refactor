import MixpanelAnalytics from './MixpanelAnalytics';
import { ENV, MIXPANEL_TOKEN } from '../constants';
import { createStorage } from '../storages';

const isProduction = !ENV;
const shouldEnableMixpanel = MIXPANEL_TOKEN && isProduction;

export const storage = createStorage('analytics-storage');

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, any>): void;
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
  track(action: string, payload?: Record<string, null>) {
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
      service.logout();
      storage.clearAll();
    }
  },
};

export default AnalyticsService;
