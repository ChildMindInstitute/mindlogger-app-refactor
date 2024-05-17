import { Point } from '@app/abstract/lib';
import {
  DayMonthYear,
  HourMinute,
  callApiWithRetry,
  watchForConnectionLoss,
} from '@app/shared/lib';
import { MediaFile, MediaValue } from '@app/shared/ui';

import httpService from './httpService';
import { SuccessfulEmptyResponse, SuccessfulResponse } from '../types';

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
  maximumIndex: number;
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

export type StabilityTrackerAnswerValue = {
  timestamp: number;
  stimPos: number[];
  userPos: number[];
  targetPos: number[];
  lambda: number;
  score: number;
  lambdaSlope: number;
};

export type StabilityTrackerAnswerDto = {
  value: StabilityTrackerAnswerValue[];
  maxLambda: number;
  phaseType: 'challenge-phase' | 'focus-phase';
  text?: string;
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
  | FlankerAnswerDto
  | DrawerAnswerDto
  | AbTestAnswerDto
  | null;

export type ObjectAnswerDto =
  | {
      value?: AnswerValueDto;
      text?: string;
    }
  | StabilityTrackerAnswerDto;

export type AnswerDto = TextAnswerDto | ObjectAnswerDto | null;

export type AnswerAlertDto = {
  activityItemId: string;
  message: string;
};

export type AnswerAlertsDto = Array<AnswerAlertDto>;

export type EncryptedAnswerDto = {
  itemIds: string[];
  answer: string;
  events: string;
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userPublicKey: string;
  identifier?: string;
  scheduledEventId: string;
  localEndDate: string;
  localEndTime: string;
  tzOffset: number;
};

export type UserActionDto = {
  type:
    | 'SET_ANSWER'
    | 'PREV'
    | 'NEXT'
    | 'DONE'
    | 'UNDO'
    | 'SKIP'
    | 'SKIP_POPUP_CONFIRM'
    | 'SKIP_POPUP_CANCEL';
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
  isFlowCompleted: boolean;
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

type CheckIfAnswersExistRequest = {
  appletId: string;
  createdAt: number;
  activityId: string;
};

type CheckIfAnswersExistResponse = SuccessfulResponse<{
  exists: boolean;
}>;

function answerService() {
  return {
    async sendActivityAnswers(request: ActivityAnswersRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const response = await httpService.post<ActivityAnswersResponse>(
            '/answers',
            request,
            {
              signal: abortController.signal,
            },
          );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },
    async checkIfAnswersExist(request: CheckIfAnswersExistRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const response = await httpService.post<CheckIfAnswersExistResponse>(
            '/answers/check-existence',
            request,
            {
              signal: abortController.signal,
            },
          );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },
  };
}

export const AnswerService = answerService();
