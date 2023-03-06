import httpService from './httpService';
import { SuccessfulResponse } from '../types';

type ActivityItemDto = {
  id: number;
  question: string;
  responseType: string;
  answers: {};
  colorPalette: string;
  timer: number;
  hasTokenValue: true;
  isSkippable: true;
  hasAlert: true;
  hasScore: true;
  isRandom: true;
  isAbleToMoveToPrevious: true;
  hasTextResponse: true;
  ordering: number;
};

type ActivityDto = {
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

function appletsService() {
  return {
    getById(id: string) {
      return httpService.get<ActivityResponse>(`/activities/${id}`);
    },
  };
}

export default appletsService();
