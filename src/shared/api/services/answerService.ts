import { AxiosResponse } from 'axios';

import { DayMonthYear, HourMinute } from '@app/shared/lib';
import { MediaValue } from '@app/shared/ui';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export type TextAnswerDto = string;

export type SliderAnswerDto = number;

export type NumberSelectAnswerDto = string;

export type StackedSliderAnswerDto = Array<number>;

export type CheckboxAnswerDto = number[];

export type StackedCheckboxAnswerDto = Array<Array<string>>;

export type RadioAnswerDto = number;

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

export type ObjectAnswerDto = {
  value: AnswerValueDto;
  text?: string;
};

export type AnswerDto = TextAnswerDto | ObjectAnswerDto | null;

export type EncryptedAnswerDto = {
  itemIds: string[];
  answer: string;
  events: string;
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userPublicKey: string;
};

export type UserActionDto = {
  type: 'SET_ANSWER' | 'PREV' | 'NEXT' | 'DONE' | 'UNDO';
  screen: string;
  time: number;
  response?: AnswerDto;
};

export type ActivityAnswersRequest = {
  appletId: string;
  activityId: string;
  flowId: string | null;
  version: string;
  createdAt: number;
  answer: EncryptedAnswerDto;
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
