import { AbTestPayload, FlankerItemSettings } from '@app/abstract/lib';
import { ConditionalLogic } from '@app/entities/activity';
import { DrawResult } from '@app/entities/drawer';
import { FlankerGameResponse } from '@app/entities/flanker';
import { HourMinute } from '@app/shared/lib';
import {
  Coordinates,
  Item,
  StackedItem,
  StackedRowItemValue,
} from '@app/shared/ui';
import { AbTestResult } from '@entities/abTrail';
import { StabilityTrackerResponse as StabilityTrackerBaseResponse } from '@entities/stabilityTracker';
import { UnityResult } from '@entities/unityView';
import { MediaFile } from '@shared/ui';
import { RadioOption } from '@shared/ui/survey/RadioActivityItem';

import { Tutorial } from './tutorial';

export type ActivityItemType =
  | 'AbTest'
  | 'Unity'
  | 'StabilityTracker'
  | 'DrawingTest'
  | 'Tutorial'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'ParagraphText'
  | 'TimeRange'
  | 'Audio'
  | 'Message'
  | 'AudioPlayer'
  | 'StackedSlider'
  | 'StackedCheckbox'
  | 'StackedRadio'
  | 'Radio'
  | 'Slider'
  | 'NumberSelect'
  | 'Checkbox'
  | 'Geolocation'
  | 'Photo'
  | 'Video'
  | 'Date'
  | 'Time';

export type DataMatrix = Array<{
  rowId: string;
  options: DataMatrixOptions;
}>;

export type DataMatrixOptions = Array<{
  optionId: string;
  score: number;
  alert: {
    message: string;
  } | null;
}>;

type StabilityTrackerPayload = {
  phase: 'practice' | 'test';
  lambdaSlope: number;
  durationMinutes: number;
  trialsNumber: number;
  userInputType: 'gyroscope' | 'touch';
};

type UnityPayload = {
  file: string | null;
};

type SplashPayload = { imageUrl: string };

type DrawingPayload = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  proportionEnabled: boolean;
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
  alerts: Array<{
    value: number;
    minValue: number | null;
    maxValue: number | null;
    message: string;
  }> | null;
  scores: Array<number>;
};

type AudioPayload = {
  maxDuration: number;
};

type MessagePayload = {
  alignToLeft: boolean;
};

type AudioPlayerPayload = {
  file: string;
  playOnce: boolean;
};

type StackedCheckboxPayload = {
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrix;
};

type StackedRadioPayload = {
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrix;
};

type StackedSliderPayload = {
  addScores: boolean;
  setAlerts: boolean;
  rows: {
    id: string;
    label: string;
    leftTitle: string | null;
    rightTitle: string | null;
    minValue: number;
    maxValue: number;
    leftImageUrl: string | null;
    rightImageUrl: string | null;
    alerts: Array<{
      value: number;
      message: string;
    }> | null;
  }[];
};

type TimeRangePayload = null;

type TimePayload = null;

type RadioPayload = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  autoAdvance: boolean;
  isGridView: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
    value: number;
    alert: {
      message: string;
    } | null;
  }>;
};

type CheckboxPayload = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  isGridView: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
    value: number;
    alert: {
      message: string;
    } | null;
    isNoneOption: boolean;
  }>;
};

export type FlankerPayload = FlankerItemSettings;

type TextInputPayload = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
};

type ParagraphTextPayload = {
  maxLength: number;
};

type NumberSelectPayload = {
  max: number;
  min: number;
};

type GeolocationPayload = null;

type DatePayload = null;

type PhotoPayload = null;

type VideoPayload = null;

type PipelinePayload =
  | AbTestPayload
  | StabilityTrackerPayload
  | UnityPayload
  | SplashPayload
  | Tutorial
  | DrawingPayload
  | FlankerPayload
  | TextInputPayload
  | ParagraphTextPayload
  | RadioPayload
  | TimeRangePayload
  | AudioPayload
  | MessagePayload
  | StackedSliderPayload
  | StackedCheckboxPayload
  | StackedRadioPayload
  | AudioPlayerPayload
  | SliderPayload
  | NumberSelectPayload
  | CheckboxPayload
  | GeolocationPayload
  | PhotoPayload
  | DatePayload
  | TimePayload;

type PipelineItemBase = {
  id?: string;
  name?: string;
  type: ActivityItemType;
  payload: PipelinePayload;
  isSkippable?: boolean;
  isAbleToMoveBack?: boolean;
  canBeReset?: boolean;
  hasTopNavigation?: boolean;
  question?: string;
  timer: number | null;
  validationOptions?: {
    correctAnswer?: string;
  };
  additionalText?: {
    required: boolean;
  };
  conditionalLogic?: ConditionalLogic;
};

export interface AbTestPipelineItem extends PipelineItemBase {
  type: 'AbTest';
  payload: AbTestPayload;
}

export interface StabilityTrackerPipelineItem extends PipelineItemBase {
  type: 'StabilityTracker';
  payload: StabilityTrackerPayload;
}

export interface UnityPipelineItem extends PipelineItemBase {
  type: 'Unity';
  payload: UnityPayload;
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
  payload: FlankerPayload;
}

export interface TextInputPipelineItem extends PipelineItemBase {
  type: 'TextInput';
  payload: TextInputPayload;
}

export interface ParagraphTextPipelineItem extends PipelineItemBase {
  type: 'ParagraphText';
  payload: ParagraphTextPayload;
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

export interface GeolocationPipelineItem extends PipelineItemBase {
  type: 'Geolocation';
  payload: GeolocationPayload;
}
export interface AudioPipelineItem extends PipelineItemBase {
  type: 'Audio';
  payload: AudioPayload;
}
export interface MessagePipelineItem extends PipelineItemBase {
  type: 'Message';
  payload: MessagePayload;
}
export interface AudioPlayerPipelineItem extends PipelineItemBase {
  type: 'AudioPlayer';
  payload: AudioPlayerPayload;
}
export interface StackedCheckboxPipelineItem extends PipelineItemBase {
  type: 'StackedCheckbox';
  payload: StackedCheckboxPayload;
}

export interface StackedRadioPipelineItem extends PipelineItemBase {
  type: 'StackedRadio';
  payload: StackedRadioPayload;
}

export interface StackedSliderPipelineItem extends PipelineItemBase {
  type: 'StackedSlider';
  payload: StackedSliderPayload;
}

export interface TimeRangePipelineItem extends PipelineItemBase {
  type: 'TimeRange';
  payload: TimeRangePayload;
}
export interface PhotoPipelineItem extends PipelineItemBase {
  type: 'Photo';
  payload: PhotoPayload;
}

export interface VideoPipelineItem extends PipelineItemBase {
  type: 'Video';
  payload: VideoPayload;
}

export interface DatePipelineItem extends PipelineItemBase {
  type: 'Date';
  payload: DatePayload;
}
export interface TimePipelineItem extends PipelineItemBase {
  type: 'Time';
  payload: TimePayload;
}

export type StabilityTrackerResponse = StabilityTrackerBaseResponse;

export type AbTestResponse = AbTestResult;

export type UnityResponse = UnityResult;

export type DrawingTestResponse = DrawResult;

export type FlankerResponse = FlankerGameResponse;

export type TextInputResponse = string;

export type ParagraphTextResponse = string;

export type GeolocationResponse = Coordinates;

export type SliderResponse = number | null;

export type NumberSelectResponse = string;

export type CheckboxResponse = Item[] | null;

export type DateResponse = string | null;

export type AudioResponse = MediaFile;

export type AudioPlayerResponse = boolean;

export type TimeRangeResponse = {
  startTime: HourMinute | null;
  endTime: HourMinute | null;
};

export type RadioResponse = RadioOption;

export type TimeResponse = HourMinute;

export type StackedCheckboxResponse = Array<Array<StackedItem>> | null;

export type StackedRadioResponse = Array<
  StackedRowItemValue & {
    rowId: string;
  }
>;

export type StackedSliderResponse = Array<number>;

export type PhotoResponse = MediaFile & {
  size: number;
  fromLibrary: boolean;
};

export type VideoResponse = MediaFile & {
  size: number;
  fromLibrary: boolean;
};

export type PipelineItemResponse =
  | AbTestResponse
  | UnityResponse
  | StabilityTrackerResponse
  | FlankerResponse
  | DrawingTestResponse
  | TextInputResponse
  | ParagraphTextResponse
  | SliderResponse
  | NumberSelectResponse
  | CheckboxResponse
  | StackedRadioResponse
  | StackedSliderResponse
  | StackedCheckboxResponse
  | AudioResponse
  | AudioPlayerResponse
  | TimeRangeResponse
  | GeolocationResponse
  | PhotoResponse
  | DateResponse
  | RadioResponse
  | TimeResponse;

export type PipelineItem =
  | AbTestPipelineItem
  | UnityPipelineItem
  | StabilityTrackerPipelineItem
  | SplashPipelineItem
  | TutorialPipelineItem
  | DrawingTestPipelineItem
  | FlankerPipelineItem
  | TextInputPipelineItem
  | ParagraphTextPipelineItem
  | SliderPipelineItem
  | NumberSelectPipelineItem
  | CheckboxPipelineItem
  | StackedSliderPipelineItem
  | StackedCheckboxPipelineItem
  | StackedRadioPipelineItem
  | AudioPipelineItem
  | MessagePipelineItem
  | AudioPlayerPipelineItem
  | TimeRangePipelineItem
  | GeolocationPipelineItem
  | PhotoPipelineItem
  | VideoPipelineItem
  | RadioPipelineItem
  | DatePipelineItem
  | TimePipelineItem;

export type PipelineItemType = PipelineItem['type'];
