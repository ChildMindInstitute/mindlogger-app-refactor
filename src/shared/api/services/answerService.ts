import { AxiosResponse } from 'axios';

// import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

type AnswerDto = {
  activityItemId: string;
  answer: {
    value: any;
  };
};

type ActivityAnswersRequest = {
  appletId: string;
  version: string;
  activityId: string;
  flowId?: string;
  answers: AnswerDto[];
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

export default answerService();
