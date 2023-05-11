import { DrawResult } from '@app/entities/drawer';
import { FlankerLogRecord, FlankerConfiguration } from '@app/entities/flanker';
import { HourMinute } from '@app/shared/lib';
import { Coordinates } from '@app/shared/ui';
import { LogLine, DeviceType, TestIndex } from '@entities/abTrail';

import { Tutorial } from './tutorial';

export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Tutorial'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
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

type AudioPayload = {
  maxDuration: number;
};

type MessagePayload = null;

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
  dataMatrix: Array<{
    rowId: string;
    options: [
      {
        optionId: string;
        score: number;
        alert: string;
      },
    ];
  }>;
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
  dataMatrix: Array<{
    rowId: string;
    options: [
      {
        optionId: string;
        score: number;
        alert: string;
      },
    ];
  }>;
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
  }[];
};

type TimeRangePayload = null;

type TimePayload = null;

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

type GeolocationPayload = null;

type DatePayload = null;

type PhotoPayload = null;

type VideoPayload = null;

type PipelinePayload =
  | AbTestPayload
  | SplashPayload
  | Tutorial
  | DrawingPayload
  | FlankerPayload
  | TextInputPayload
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

export type AbTestResponse = LogLine[];

export type DrawingTestResponse = DrawResult;

export type FlankerResponse = Array<FlankerLogRecord>;

export type TextInputResponse = string;

export type GeolocationResponse = Coordinates;

export type SliderResponse = number | null;

export type NumberSelectResponse = string;

export type CheckboxResponse = string[] | null;

export type DateResponse = string | null;

export type AudioResponse = {
  filePath: string;
};

export type AudioPlayerResponse = boolean;

export type TimeRangeResponse = {
  startTime: string;
  endTime: string;
};

export type RadioResponse = string;

export type TimeResponse = HourMinute;

export type StackedCheckboxResponse = {
  rowId: string;
  optionIds: string[];
}[];

export type StackedRadioResponse = Array<{
  rowId: string;
  optionId: string;
}>;

export type StackedSliderResponse = Array<{
  rowId: string;
  value: number;
}>;

export type PhotoResponse = {
  uri: string;
  fileName: string;
  size: number;
  type: string;
  fromLibrary: boolean;
};

export type VideoResponse = {
  uri: string;
  fileName: string;
  size: number;
  type: string;
  fromLibrary: boolean;
};

export type PipelineItemResponse =
  | AbTestResponse
  | FlankerResponse
  | DrawingTestResponse
  | TextInputResponse
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
  | SplashPipelineItem
  | TutorialPipelineItem
  | DrawingTestPipelineItem
  | FlankerPipelineItem
  | TextInputPipelineItem
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
