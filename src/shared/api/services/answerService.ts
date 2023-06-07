import { AxiosResponse } from 'axios';

import { DayMonthYear, HourMinute } from '@app/shared/lib';
import { MediaValue } from '@app/shared/ui';
import { AppletEncryptionDTO } from '@shared/api';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export type TextAnswerDto = string;

export type SliderAnswerDto = { value: number };

export type NumberSelectAnswerDto = string;

export type StackedSliderAnswerDto = Array<number>;

export type CheckboxAnswerDto = { value: number[] };

export type StackedCheckboxAnswerDto = Array<Array<string>>;

export type RadioAnswerDto = { value: number };

export type StackedRadioAnswerDto = Array<string>;

export type AudioAnswerDto = MediaValue;

export type AudioPlayerAnswerDto = boolean;

export type PhotoAnswerDto = MediaValue;

export type VideoAnswerDto = MediaValue;

export type TimeRangeAnswerDto = {
  from: { hour: number; minute: number };
  to: { hour: number; minute: number };
};

export type TimeAnswerDto = HourMinute;

export type DateAnswerDto = DayMonthYear;

export type GeolocationAnswerDto = {
  latitude: number;
  longitude: number;
};

export type AnswerValueDto =
  | TextAnswerDto
  | SliderAnswerDto
  | NumberSelectAnswerDto
  | StackedSliderAnswerDto
  | StackedCheckboxAnswerDto
  | StackedRadioAnswerDto
  | RadioAnswerDto
  | CheckboxAnswerDto
  | AudioAnswerDto
  | AudioPlayerAnswerDto
  | PhotoAnswerDto
  | VideoAnswerDto
  | TimeRangeAnswerDto
  | TimeAnswerDto
  | DateAnswerDto
  | GeolocationAnswerDto
  | null;

export type AnswerDto = {
  value: AnswerValueDto;
  text?: string;
} | null;

export type EncryptedAnswerDto = {
  activityId: string;
  itemIds: string[];
  flowId: string | null;
  answer: string;
};

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
