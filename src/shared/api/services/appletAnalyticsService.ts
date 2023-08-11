import { AxiosResponse } from 'axios';

import { AppletAnalyticsDto } from './AppletAnalyticsDto';
import httpService from './httpService';
import { appletAnalyticsMock } from './mockAppletAnalytics';
import { SuccessfulResponse } from '../types';

export * from './AppletAnalyticsDto';

const mockAnalytics = false;

type ActivityAnalyticsResponse = SuccessfulResponse<AppletAnalyticsDto>;

type FakeResponse = AxiosResponse<ActivityAnalyticsResponse>;

type ActivityAnalyticsRequest = {
  appletId: string;
};

function appletAnalyticsService() {
  return {
    // eslint-disable-next-line
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      if (mockAnalytics) {
        const response: FakeResponse = {
          status: 200,
          data: { result: appletAnalyticsMock },
        } as FakeResponse;

        return Promise.resolve(response);
      }

      return httpService.get<ActivityAnalyticsResponse>(
        `/answers/applet/${request.appletId}/data/mobile`,
      );
    },
  };
}

export const AppletAnalyticsService = appletAnalyticsService();
