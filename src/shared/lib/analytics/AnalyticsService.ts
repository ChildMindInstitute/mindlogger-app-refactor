import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { IAnalyticsService } from './IAnalyticsService';
import { MixpanelAnalytics } from './MixpanelAnalytics';
import { MIXPANEL_TOKEN } from '../constants';
import { getDefaultLogger } from '../services/loggerInstance';

let service: IAnalyticsService;

export const MixProperties = {
  AppletId: 'Applet ID',
  MindLoggerVersion: 'MindLogger Version',
  SubmitId: 'Submit ID',
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

export const AnalyticsService = {
  shouldEnableMixpanel() {
    return !!MIXPANEL_TOKEN;
  },
  async init(): Promise<void> {
    if (this.shouldEnableMixpanel()) {
      getDefaultLogger().log(
        '[AnalyticsService]: Create and init MixpanelAnalytics object',
      );
      service = new MixpanelAnalytics(MIXPANEL_TOKEN!);
      return service.init();
    }
  },
  track(action: string, payload?: Record<string, any>) {
    if (payload) {
      getDefaultLogger().log(
        `[AnalyticsService]: Action: ${action}, payload: ${JSON.stringify(
          payload,
        )}`,
      );
    } else {
      getDefaultLogger().log('[AnalyticsService]: Action: ' + action);
    }

    if (this.shouldEnableMixpanel()) {
      service.track(`[Mobile] ${action}`, payload);
    }
  },
  async login(userId: string) {
    const isLoggedIn = getDefaultStorageInstanceManager()
      .getAnalyticsStorage()
      .getBoolean('IS_LOGGED_IN');

    if (this.shouldEnableMixpanel() && !isLoggedIn) {
      return service.login(userId).then(() => {
        getDefaultStorageInstanceManager()
          .getAnalyticsStorage()
          .set('IS_LOGGED_IN', true);
      });
    }
  },
  logout() {
    if (this.shouldEnableMixpanel()) {
      this.track('Logout');
      service.logout();
      getDefaultStorageInstanceManager().getAnalyticsStorage().clearAll();
    }
  },
};
