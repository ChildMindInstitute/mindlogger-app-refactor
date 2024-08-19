import { Coordinates } from '@app/shared/ui/survey/Geolocation/types';

import {
  PipelineItemResponse,
  ActivityItemType,
  TextInputResponse,
  ParagraphTextResponse,
  AbTestResponse,
  UnityResponse,
  StabilityTrackerResponse,
  DrawingTestResponse,
  FlankerResponse,
  SliderResponse,
  NumberSelectResponse,
  CheckboxResponse,
  AudioResponse,
  StackedSliderResponse,
  StackedCheckboxResponse,
  AudioPlayerResponse,
  TimeRangeResponse,
  RadioResponse,
  PhotoResponse,
  VideoResponse,
  DateResponse,
  TimeResponse,
  StackedRadioResponse,
} from './payload';

export type PipelineItemAnswerBase = {
  type: ActivityItemType;
  value: {
    answer?: PipelineItemResponse;
    additionalAnswer?: string;
  };
};

export interface SplashPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Splash';
  value: {
    answer: null;
    additionalAnswer?: string;
  };
}

export interface ParagraphTextPipelineAnswer extends PipelineItemAnswerBase {
  type: 'ParagraphText';
  value: {
    answer?: ParagraphTextResponse;
    additionalAnswer?: string;
  };
}

export interface TextInputPipelineAnswer extends PipelineItemAnswerBase {
  type: 'TextInput';
  value: {
    answer?: TextInputResponse;
    additionalAnswer?: string;
  };
}

export interface AbTestPipelineAnswer extends PipelineItemAnswerBase {
  type: 'AbTest';
  value: {
    answer?: AbTestResponse;
    additionalAnswer?: string;
  };
}

interface UnityPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Unity';
  value: {
    answer?: UnityResponse;
    additionalAnswer?: string;
  };
}

interface StabilityTrackerPipelineAnswer extends PipelineItemAnswerBase {
  type: 'StabilityTracker';
  value: {
    answer?: StabilityTrackerResponse;
    additionalAnswer?: string;
  };
}

export interface DrawingTestPipelineAnswer extends PipelineItemAnswerBase {
  type: 'DrawingTest';
  value: {
    answer?: DrawingTestResponse;
    additionalAnswer?: string;
  };
}

export interface FlankerPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Flanker';
  value: {
    answer?: FlankerResponse;
    additionalAnswer?: string;
  };
}

export interface SliderPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Slider';
  value: {
    answer?: SliderResponse;
    additionalAnswer?: string;
  };
}

export interface NumberSelectPipelineAnswer extends PipelineItemAnswerBase {
  type: 'NumberSelect';
  value: {
    answer?: NumberSelectResponse;
    additionalAnswer?: string;
  };
}

export interface CheckboxPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Checkbox';
  value: {
    answer?: CheckboxResponse;
    additionalAnswer?: string;
  };
}

export interface AudioPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Audio';
  value: {
    answer?: AudioResponse;
    additionalAnswer?: string;
  };
}

export interface MessagePipelineAnswer extends PipelineItemAnswerBase {
  type: 'Message';
  value: {
    answer: null;
    additionalAnswer?: string;
  };
}

export interface StackedSliderPipelineAnswer extends PipelineItemAnswerBase {
  type: 'StackedSlider';
  value: {
    answer?: StackedSliderResponse;
    additionalAnswer?: string;
  };
}

export interface StackedCheckboxPipelineAnswer extends PipelineItemAnswerBase {
  type: 'StackedCheckbox';
  value: {
    answer?: StackedCheckboxResponse;
    additionalAnswer?: string;
  };
}

export interface StackedRadioPipelineAnswer extends PipelineItemAnswerBase {
  type: 'StackedRadio';
  value: {
    answer?: StackedRadioResponse; // @todo check with BE
    additionalAnswer?: string;
  };
}

export interface AudioPlayerPipelineAnswer extends PipelineItemAnswerBase {
  type: 'AudioPlayer';
  value: {
    answer?: AudioPlayerResponse;
    additionalAnswer?: string;
  };
}

export interface TimeRangePipelineAnswer extends PipelineItemAnswerBase {
  type: 'TimeRange';
  value: {
    answer?: TimeRangeResponse;
    additionalAnswer?: string;
  };
}

export interface RadioPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Radio';
  value: {
    answer?: RadioResponse;
    additionalAnswer?: string;
  };
}

export interface GeolocationPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Geolocation';
  value: {
    answer?: Coordinates;
    additionalAnswer?: string;
  };
}

export interface DatePipelineAnswer extends PipelineItemAnswerBase {
  type: 'Date';
  value: {
    answer?: DateResponse;
    additionalAnswer?: string;
  };
}

export interface PhotoPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Photo';
  value: {
    answer?: PhotoResponse;
    additionalAnswer?: string;
  };
}

export interface VideoPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Video';
  value: {
    answer?: VideoResponse;
    additionalAnswer?: string;
  };
}

export interface TimePipelineAnswer extends PipelineItemAnswerBase {
  type: 'Time';
  value: {
    answer?: TimeResponse;
    additionalAnswer?: string;
  };
}

export type PipelineItemAnswer =
  | SplashPipelineAnswer
  | TextInputPipelineAnswer
  | ParagraphTextPipelineAnswer
  | AbTestPipelineAnswer
  | UnityPipelineAnswer
  | StabilityTrackerPipelineAnswer
  | DrawingTestPipelineAnswer
  | FlankerPipelineAnswer
  | NumberSelectPipelineAnswer
  | SliderPipelineAnswer
  | RadioPipelineAnswer
  | AudioPipelineAnswer
  | MessagePipelineAnswer
  | StackedSliderPipelineAnswer
  | StackedCheckboxPipelineAnswer
  | StackedRadioPipelineAnswer
  | AudioPlayerPipelineAnswer
  | TimeRangePipelineAnswer
  | GeolocationPipelineAnswer
  | PhotoPipelineAnswer
  | VideoPipelineAnswer
  | DatePipelineAnswer
  | TimePipelineAnswer
  | CheckboxPipelineAnswer;
