import { AxiosResponse } from 'axios';

import { ActivityDto } from './IActivityService';
import { SuccessfulResponse } from '../types';

export type AnalyticsAnswerDto = {
  answer: string;
  createdAt: string;
  itemIds: string[];
  activityId: string;
};

export type ActivityAnalyticsDto = {
  activities: ActivityDto[];
  answers: AnalyticsAnswerDto[];
};

export type ActivityAnalyticsResponse =
  SuccessfulResponse<ActivityAnalyticsDto>;

export type ActivityAnalyticsRequest = {
  appletId: string;
  fromDate: string; // YYYY-MM-DD HH:mm:ss
  isLastVersion: boolean;
  respondentIds: string;
};

export type IAppletAnalyticsService = {
  getActivityAnalytics: (
    request: ActivityAnalyticsRequest,
  ) => Promise<AxiosResponse<ActivityAnalyticsResponse>>;
};
