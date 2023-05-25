import { AxiosResponse } from 'axios';

import { AppletEncryptionDTO } from '@shared/api';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export type EncryptedAnswerDto = {
  activityId: string;
  itemIds: (string | undefined)[];
  flowId: string | null;
  answer: string;
};

export type AnswerDto = {
  activityId: string;
  flowId: string | null;
  itemIds: (string | undefined)[];
  answer: {
    value: string | number | Array<string> | any;
    additionalText?: string;
    shouldIdentifyResponse?: boolean;
  };
};

type ActivityAnswersRequest = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[] | EncryptedAnswerDto[];
  publicKey?: string;
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
