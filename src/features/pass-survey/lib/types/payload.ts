import { DrawResult } from '@app/entities/drawer';
import { FlankerLogRecord, FlankerConfiguration } from '@app/entities/flanker';
import { LogLine, DeviceType, TestIndex } from '@entities/abTrail';

import { Tutorial } from './tutorial';

export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Tutorial'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'Radio'
  | 'Slider'
  | 'NumberSelect'
  | 'Checkbox';

type AbTestPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

type SplashPayload = { imageUrl: string };

type DrawingPayload = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};

type SliderPayload = {
  leftTitle: string | null;
  rightTitle: string | null;
  minValue: number;
  maxValue: number;
  leftImageUrl: string | null;
  rightImageUrl: string | null;
  showTickMarks: boolean | null;
  showTickLabels: boolean | null;
  isContinuousSlider: boolean | null;
};

type RadioPayload = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
  }>;
};

type CheckboxPayload = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
  }>;
};

type FlankerPayload = FlankerConfiguration;

type TextInputPayload = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
};

type NumberSelectPayload = {
  max: number;
  min: number;
};

type PipelinePayload =
  | AbTestPayload
  | SplashPayload
  | Tutorial
  | DrawingPayload
  | FlankerPayload
  | TextInputPayload
  | RadioPayload
  | SliderPayload
  | NumberSelectPayload
  | CheckboxPayload;

type PipelineItemBase = {
  id?: string;
  type: ActivityItemType;
  payload: PipelinePayload;
  isSkippable?: boolean;
  isAbleToMoveBack?: boolean;
  canBeReset?: boolean;
  hasTopNavigation?: boolean;
  question?: string;
  validationOptions?: {
    correctAnswer?: string;
  };
  additionalText?: {
    required: boolean;
  };
  variableName?: string;
};

export interface AbTestPipelineItem extends PipelineItemBase {
  type: 'AbTest';
  payload: AbTestPayload;
}

export interface SplashPipelineItem extends PipelineItemBase {
  type: 'Splash';
  payload: SplashPayload;
}

export interface TutorialPipelineItem extends PipelineItemBase {
  type: 'Tutorial';
  payload: Tutorial;
}

export interface DrawingTestPipelineItem extends PipelineItemBase {
  type: 'DrawingTest';
  payload: DrawingPayload;
}

export interface SliderPipelineItem extends PipelineItemBase {
  type: 'Slider';
  payload: SliderPayload;
}

export interface FlankerPipelineItem extends PipelineItemBase {
  type: 'Flanker';
  payload: FlankerConfiguration;
}

export interface TextInputPipelineItem extends PipelineItemBase {
  type: 'TextInput';
  payload: TextInputPayload;
}

export interface NumberSelectPipelineItem extends PipelineItemBase {
  type: 'NumberSelect';
  payload: NumberSelectPayload;
}

export interface CheckboxPipelineItem extends PipelineItemBase {
  type: 'Checkbox';
  payload: CheckboxPayload;
}

export interface RadioPipelineItem extends PipelineItemBase {
  type: 'Radio';
  payload: RadioPayload;
}

export type AbTestResponse = LogLine[];

export type DrawingTestResponse = DrawResult;

export type FlankerResponse = Array<FlankerLogRecord>;

export type TextInputResponse = string;

export type SliderResponse = number | null;

export type NumberSelectResponse = string;

export type CheckboxResponse = string[] | null;

export type RadioResponse = string;

export type PipelineItemResponse =
  | AbTestResponse
  | FlankerResponse
  | DrawingTestResponse
  | TextInputResponse
  | SliderResponse
  | NumberSelectResponse
  | CheckboxResponse
  | RadioResponse;

export type PipelineItem =
  | AbTestPipelineItem
  | SplashPipelineItem
  | TutorialPipelineItem
  | DrawingTestPipelineItem
  | FlankerPipelineItem
  | TextInputPipelineItem
  | SliderPipelineItem
  | NumberSelectPipelineItem
  | CheckboxPipelineItem
  | RadioPipelineItem;
