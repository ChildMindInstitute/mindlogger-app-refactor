import { AxiosResponse } from 'axios';

import { AppletAnalyticsDto } from './AppletAnalyticsDto';
import { appletAnalyticsMock } from './mockAppletAnalytics';
import { SuccessfulResponse } from '../types';

export * from './AppletAnalyticsDto';

const mockAnalytics = true;

type ActivityAnswersResponse = SuccessfulResponse<AppletAnalyticsDto>;

type FakeResponse = AxiosResponse<ActivityAnswersResponse>;

type ActivityAnalyticsRequest = {
  appletId: string;
};

function appletAnalyticsService() {
  return {
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      console.info('[Analytics]: requested for ', request.appletId);
      if (mockAnalytics) {
        const response: FakeResponse = {
          status: 200,
          data: { result: appletAnalyticsMock },
        } as FakeResponse;

        return Promise.resolve(response);
      }
    },
  };
}

export const AppletAnalyticsService = appletAnalyticsService();
