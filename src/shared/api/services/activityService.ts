import { AxiosResponse } from 'axios';

import { ImageUrl } from '@app/shared/lib';

import { ActivityItemDto } from './ActivityItemDto';
import httpService from './httpService';
import { getTestActivity } from './mockActivities';
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
};

export type ActivityResponse = SuccessfulResponse<ActivityDto>;

const mockActivity = true;

type FakeResponse = AxiosResponse<ActivityResponse>;

function activityService() {
  return {
    async getById(id: string) {
      if (mockActivity) {
        const response: FakeResponse = {
          status: 200,
          data: { result: getTestActivity() },
        } as FakeResponse;
        return Promise.resolve(response);
      } else {
        return httpService.get<ActivityResponse>(`/activities/${id}`);
      }
    },
  };
}

export const ActivityService = activityService();
