import { withDataExtraction } from '@app/shared/lib';

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
  fromDate: string; // YYYY-MM-DD HH:mm:ss
  isLastVersion: boolean;
  respondentIds: string;
};

function appletAnalyticsService() {
  return {
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      const apiCall = () =>
        httpService.get<ActivityAnalyticsResponse>(`/answers/applet/${request.appletId}/data`, {
          params: {
            fromDate: request.fromDate,
            activitiesLastVersion: request.isLastVersion,
            respondentIds: request.respondentIds,
          },
        });
      return withDataExtraction(apiCall)();
    },
  };
}

export const AppletAnalyticsService = appletAnalyticsService();
