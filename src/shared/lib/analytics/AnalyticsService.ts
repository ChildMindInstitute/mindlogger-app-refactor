import MixpanelAnalytics, { IAnalyticsService } from './MixpanelAnalytics';
import { MIXPANEL_TOKEN } from '../constants';
import { Logger } from '../services';
import { createStorage } from '../storages';

const shouldEnableMixpanel = !!MIXPANEL_TOKEN;

export const storage = createStorage('analytics-storage');

let service: IAnalyticsService;

export const MixProperties = {
  AppletId: 'Applet ID',
  MindLoggerVersion: 'MindLogger Version',
};

export const MixEvents = {
  DataView: 'Data View',
  AppletView: 'Applet View',
  HomeView: 'Home Page View',
  AssessmentStarted: 'Assessment started',
  AssessmentCompleted: 'Assessment completed',
  RetryButtonPressed: 'Retry button pressed',
  LoginSuccessful: 'Login Successful',
  SignupSuccessful: 'Signup Successful',
  AppOpen: 'App Open',
  AppReOpen: 'App Re-Open',
  ActivityRestart: 'Activity Restart Button Pressed',
  ActivityResume: 'Activity Resume Button Pressed',
  AppletSelected: 'Applet Selected',
  ReturnToActivitiesPressed: 'Return to Activities pressed',
  UploadLogsPressed: 'Upload Logs Pressed',
  UploadedLogsSuccessfully: 'Uploaded Logs Successfully',
  UploadLogsError: 'Upload Logs Error Occurred',
  NotificationTap: 'Notification tap',
};

const AnalyticsService = {
  async init(): Promise<void> {
    if (shouldEnableMixpanel) {
      Logger.log(
        '[AnalyticsService]: Create and init MixpanelAnalytics object',
      );
      service = new MixpanelAnalytics(MIXPANEL_TOKEN!);
      return service.init();
    }
    return Promise.resolve();
  },
  hasInstance: () => service.hasInstance(),
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

    if (this.hasInstance()) {
      service.track(`[Mobile] ${action}`, payload);
    }
  },
  async login(userId: string) {
    const isLoggedIn = storage.getBoolean('IS_LOGGED_IN');

    if (this.hasInstance() && !isLoggedIn) {
      return service.login(userId).then(() => {
        storage.set('IS_LOGGED_IN', true);
      });
    }
  },
  logout() {
    if (this.hasInstance()) {
      this.track('Logout');
      service.logout();
      storage.clearAll();
    }
  },
};

export default AnalyticsService;
