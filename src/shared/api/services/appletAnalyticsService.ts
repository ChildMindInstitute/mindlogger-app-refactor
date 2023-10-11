import { ActivityDto } from './activityService';
import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export * from './AppletAnalyticsDto';

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

type ActivityAnalyticsRequest = {
  appletId: string;
  fromDate: string;
  isLastVersion: boolean;
};

function appletAnalyticsService() {
  return {
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      return httpService.get<ActivityAnalyticsResponse>(
        `/answers/applet/${request.appletId}/data`,
        {
          params: {
            fromDate: request.fromDate,
            activitiesLastVersion: request.isLastVersion,
          },
        },
      );
    },
  };
}

export const AppletAnalyticsService = appletAnalyticsService();
