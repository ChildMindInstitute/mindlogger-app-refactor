import { appletAnalyticsService } from './appletAnalyticsService';

let instance: ReturnType<typeof appletAnalyticsService>;
export const getDefaultAppletAnalyticsService = () => {
  if (!instance) {
    instance = appletAnalyticsService();
  }
  return instance;
};
