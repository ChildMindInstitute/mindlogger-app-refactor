import { AxiosResponse } from 'axios';

import { AppletEncryptionDTO } from '@shared/api';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export type EncryptedAnswerDto = {
  activityId: string;
  itemIds: string[];
  flowId: string | null;
  answer: string;
};

export type AnswerDto =
  | string
  | number
  | { value: any; text: string }
  | Array<string>
  | any;

type ActivityAnswersRequest = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: EncryptedAnswerDto[];
  userPublicKey?: string;
  appletEncryption?: AppletEncryptionDTO | null;
};

type ActivityAnswersResponse = SuccessfulEmptyResponse;

type FakeResponse = AxiosResponse<ActivityAnswersResponse>;

const mockActivity = false;

function answerService() {
  return {
    sendActivityAnswers(request: ActivityAnswersRequest) {
      if (mockActivity) {
        const response: FakeResponse = {} as FakeResponse;
        return Promise.resolve(response);
      }

      return httpService.post<ActivityAnswersResponse>('/answers', request);
    },
  };
}

export const AnswerService = answerService();
