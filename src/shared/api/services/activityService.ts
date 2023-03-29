import { ActivityItemDto } from './ActivityItemDto';
import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export type ActivityDto = {
  id: string;
  name: string;
  description: string;
  splashScreen: string | null;
  image: string | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  ordering: number;
  items: ActivityItemDto[];
};

type ActivityResponse = SuccessfulResponse<ActivityDto>;

function activityService() {
  return {
    getById(id: string) {
      return httpService.get<ActivityResponse>(`/activities/${id}`);
    },
  };
}

export const ActivityService = activityService();
