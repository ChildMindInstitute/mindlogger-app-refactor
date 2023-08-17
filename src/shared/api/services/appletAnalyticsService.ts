import { AxiosResponse } from 'axios';

// import { AppletAnalyticsDto } from './AppletAnalyticsDto';
import { ActivityDto } from './activityService';
import httpService from './httpService';
import { appletAnalyticsMock } from './mockAppletAnalytics';
import { SuccessfulResponse } from '../types';

export * from './AppletAnalyticsDto';

const mockAnalytics = false;

export type AnalyticsAnswerDto = {
  answer: string;
  createdAt: string;
  itemIds: string[];
  activityId: string;
};

type ActivityAnalyticsDto = {
  activities: ActivityDto[];
  answers: AnalyticsAnswerDto[];
};

type ActivityAnalyticsResponse = SuccessfulResponse<ActivityAnalyticsDto>;

type FakeResponse = AxiosResponse<ActivityAnalyticsResponse>;

type ActivityAnalyticsRequest = {
  appletId: string;
  fromDate: string;
};

function appletAnalyticsService() {
  return {
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      if (mockAnalytics) {
        const response: FakeResponse = {
          status: 200,
          data: { result: appletAnalyticsMock },
        } as FakeResponse;

        return Promise.resolve(response);
      }

      return httpService.get<ActivityAnalyticsResponse>(
        `/answers/applet/${request.appletId}/data`,
        { params: { fromDate: request.fromDate } },
      );
    },
  };
}

export const AppletAnalyticsService = appletAnalyticsService();
