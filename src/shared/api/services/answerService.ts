import { AxiosResponse } from 'axios';

import { Point } from '@app/abstract/lib';
import { DayMonthYear, HourMinute } from '@app/shared/lib';
import { MediaFile, MediaValue } from '@app/shared/ui';

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

export type FlankerAnswerRecordDto = {
  button_pressed: string;
  correct: boolean | undefined;
  duration: number;
  offset: number;
  question: string;
  response_touch_timestamp: number | null;
  start_time: number;
  start_timestamp: number;
  tag: string;
  trial_index: number;
};

export type FlankerAnswerDto = Array<FlankerAnswerRecordDto>;

export type DrawerPointDto = Point & { time: number };

export type DrawerLineDto = {
  points: Array<DrawerPointDto>;
  startTime: number;
};

export type DrawerAnswerDto = {
  lines: Array<DrawerLineDto>;
  svgString: string;
  width: number;
} & MediaFile;

export type AbLogPointDto = {
  x: number;
  y: number;
  start: string;
  end: string;
  time: number;
  valid: boolean | null;
  actual: string | undefined;
};

export type AbLogLineDto = { points: Array<AbLogPointDto> };

export type AbTestAnswerDto = {
  width: number;
  startTime: number;
  updated: true;
  lines: AbLogLineDto[];
  currentIndex: number;
};

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

export type StabilityTrackerAnswerDto = {
  value: {
    timestamp: number;
    stimPos: number[];
    userPos: number[];
    targetPos: number[];
    lambda: number;
    score: number;
    lambdaSlope: number;
  }[];
  maxLambda: number;
  phaseType: 'challenge-phase' | 'focus-phase';
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
  | StabilityTrackerAnswerDto
  | FlankerAnswerDto
  | DrawerAnswerDto
  | AbTestAnswerDto
  | null;

export type ObjectAnswerDto = {
  value?: AnswerValueDto;
  text?: string;
};

export type AnswerDto = TextAnswerDto | ObjectAnswerDto | null;

export type AnswerAlertsDto =
  | {
      activityItemId: string;
      message: string;
    }[]
  | null;

export type EncryptedAnswerDto = {
  itemIds: string[];
  answer: string;
  events: string;
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userPublicKey: string;
  identifier?: string;
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
  submitId: string;
  answer: EncryptedAnswerDto;
  client: {
    appId: string;
    appVersion: string;
    width: number;
    height: number;
  };
  alerts: AnswerAlertsDto;
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
