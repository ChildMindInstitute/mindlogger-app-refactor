import { AxiosResponse } from 'axios';

// import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export type AnswerDto = {
  activityItemId: string;
  answer: {
    value: string | number | Array<string>;
    additionalText?: string;
    shouldIdentifyResponse?: boolean;
  };
};

type ActivityAnswersRequest = {
  appletId: string;
  version: string;
  flowId: string | null;
  activityId: string;
  createdAt: number;
  answers: Array<AnswerDto>;
};

type ActivityAnswersResponse = SuccessfulEmptyResponse;

function answerService() {
  return {
    sendActivityAnswers(request: ActivityAnswersRequest) {
      // return httpService.post<ActivityAnswersResponse>(
      //   '/answers/activity-items',
      //   request,
      // );
      return new Promise<AxiosResponse<ActivityAnswersResponse>>(resolve => {
        setTimeout(
          () => {
            resolve({} as AxiosResponse<ActivityAnswersResponse>);
          },
          3000,
          request,
        );
      });
    },
  };
}

export const AnswerService = answerService();
