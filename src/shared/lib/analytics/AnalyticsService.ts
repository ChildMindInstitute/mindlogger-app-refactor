import MixpanelAnalytics from './MixpanelAnalytics';
import { ENV, MIXPANEL_TOKEN } from '../constants';

const isProduction = !ENV;
const shouldEnableMixpanel = MIXPANEL_TOKEN && isProduction;

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
  login(userId: string) {
    if (shouldEnableMixpanel) {
      service.login(userId);
    }
  },
  logout() {
    if (shouldEnableMixpanel) {
      service.logout();
    }
  },
};

export default AnalyticsService;
