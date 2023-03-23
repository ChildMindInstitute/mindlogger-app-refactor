import httpService from './httpService';
import { SuccessfulResponse } from '../types';

type ActivityItemDto = {
  id: number;
  inputType: string;
  config: {};
  timer: number;
  hasTokenValue: true;
  isSkippable: true;
  hasAlert: true;
  hasScore: true;
  isAbleToMoveToPrevious: true;
  hasTextResponse: true;
  order: number;
  question?: string;
};

export type ActivityDto = {
  id: string;
  name: string;
  description: string;
  splashScreen: string;
  image: string;
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
