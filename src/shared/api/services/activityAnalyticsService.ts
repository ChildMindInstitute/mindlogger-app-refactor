import { AxiosResponse } from 'axios';

import { ActivityAnalyticsDto } from './ActivityAnalyticsDto';
import { activityAnalyticsMock } from './mockActivityAnalytics';
import { SuccessfulResponse } from '../types';

const mockAnalytics = true;

type ActivityAnswersResponse = SuccessfulResponse<ActivityAnalyticsDto>;

type FakeResponse = AxiosResponse<ActivityAnswersResponse>;

function activityAnalyticsService() {
  return {
    async getActivityAnalytics() {
      if (mockAnalytics) {
        const response: FakeResponse = {
          status: 200,
          data: { result: activityAnalyticsMock },
        } as FakeResponse;
        return Promise.resolve(response);
      }
    },
  };
}

export const ActivityAnalyticsService = activityAnalyticsService();
