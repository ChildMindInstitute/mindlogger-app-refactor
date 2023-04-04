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
  | 'Slider'
  | 'NumberSelect'
  | 'Checkbox';

type AbTestPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};
type SplashPayload = null;

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
  | SliderPayload
  | NumberSelectPayload
  | CheckboxPayload;

type PipelineItemBase = {
  type: ActivityItemType;
  payload: PipelinePayload;
  isSkippable?: boolean;
  isAbleToMoveToPrevious?: boolean;
  canBeReset?: boolean;
  hasTopNavigation?: boolean;
  question?: string;
  validationOptions?: {
    correctAnswer?: string;
  };
  additionalText?: {
    required: boolean;
  };
};

interface AbTestPipelineItem extends PipelineItemBase {
  type: 'AbTest';
  payload: AbTestPayload;
}

interface SplashPipelineItem extends PipelineItemBase {
  type: 'Splash';
  payload: null;
}

interface TutorialPipelineItem extends PipelineItemBase {
  type: 'Tutorial';
  payload: Tutorial;
}

interface DrawingTestPipelineItem extends PipelineItemBase {
  type: 'DrawingTest';
  payload: DrawingPayload;
}

interface SliderPipelineItem extends PipelineItemBase {
  type: 'Slider';
  payload: SliderPayload;
}

interface FlankerPipelineItem extends PipelineItemBase {
  type: 'Flanker';
  payload: FlankerConfiguration;
}

export interface TextInputPipelineItem extends PipelineItemBase {
  type: 'TextInput';
  payload: TextInputPayload;
}

interface NumberSelectPipelineItem extends PipelineItemBase {
  type: 'NumberSelect';
  payload: NumberSelectPayload;
}

interface CheckboxPipelineItem extends PipelineItemBase {
  type: 'Checkbox';
  payload: CheckboxPayload;
}

type AbTestResponse = LogLine[];

type DrawingTestResponse = DrawResult;

type FlankerResponse = Array<FlankerLogRecord>;

type TextInputResponse =
  | {
      text: string;
      shouldIdentifyResponse: boolean;
    }
  | undefined;

type SliderResponse = number | null;

type NumberSelectResponse = string;

type CheckboxResponse = string[] | null;

export type PipelineItemResponse =
  | AbTestResponse
  | FlankerResponse
  | DrawingTestResponse
  | TextInputResponse
  | SliderResponse
  | NumberSelectResponse
  | CheckboxResponse;

export type PipelineItem =
  | AbTestPipelineItem
  | SplashPipelineItem
  | TutorialPipelineItem
  | DrawingTestPipelineItem
  | FlankerPipelineItem
  | TextInputPipelineItem
  | SliderPipelineItem
  | NumberSelectPipelineItem
  | CheckboxPipelineItem;
