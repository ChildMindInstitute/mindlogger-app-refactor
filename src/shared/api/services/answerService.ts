import { AxiosResponse } from 'axios';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

type AnswerDto = {
  activityItemHistoryId: string;
  answer: Record<string, string>;
};

type ActivityAnswersRequest = {
  appletId: string;
  appletHistoryVersion: string;
  activityId: string;
  answers: AnswerDto[];
};

type ActivityAnswersResponse = SuccessfulEmptyResponse;

type ActivityFlowAnswersRequest = {
  appletId: string;
  appletHistoryVersion: string;
  flowItemHistoryId: string;
  answers: AnswerDto[];
};

type ActivityFlowAnswersResponse = SuccessfulEmptyResponse;

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

    sendActivityFlowAnswers(request: ActivityFlowAnswersRequest) {
      return httpService.post<ActivityFlowAnswersResponse>(
        '/answers/flow-items',
        request,
      );
    },
  };
}

export default answerService();
