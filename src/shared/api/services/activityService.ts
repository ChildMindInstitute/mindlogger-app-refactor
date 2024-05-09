import { ImageUrl } from '@app/shared/lib';

import { ActivityItemDto } from './ActivityItemDto';
import { ReportDto } from './ActivityReportSettingsDtos';
import { SuccessfulResponse } from '../types';

export * from './ActivityItemDto';

export type ActivityDto = {
  id: string;
  name: string;
  description: string;
  splashScreen: ImageUrl | null;
  image: ImageUrl | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  isHidden: boolean;
  responseIsEditable: boolean;
  order: number;
  items: ActivityItemDto[];
  scoresAndReports?: {
    showScoreSummary: boolean;
    reports: Array<ReportDto>;
  };
};

export type ActivityResponse = SuccessfulResponse<ActivityDto>;

function activityService() {
  return {};
}

export const ActivityService = activityService();
