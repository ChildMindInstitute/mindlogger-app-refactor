import { Coordinates } from '@app/shared/ui';

import {
  PipelineItemResponse,
  ActivityItemType,
  TextInputResponse,
  AbTestResponse,
  DrawingTestResponse,
  FlankerResponse,
  SliderResponse,
  NumberSelectResponse,
  CheckboxResponse,
  AudioPlayerResponse,
  TimeRangeResponse,
  RadioResponse,
  PhotoResponse,
  VideoResponse,
} from './payload';

type PipelineItemAnswerBase = {
  type: Exclude<ActivityItemType, 'Tutorial'>;
  value: {
    answer?: PipelineItemResponse;
    additionalAnswer?: string;
  };
};

interface SplashPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Splash';
  value: {
    answer: null;
    additionalAnswer?: string;
  };
}

interface TextInputPipelineAnswer extends PipelineItemAnswerBase {
  type: 'TextInput';
  value: {
    answer?: TextInputResponse;
    additionalAnswer?: string;
  };
}

interface AbTestPipelineAnswer extends PipelineItemAnswerBase {
  type: 'AbTest';
  value: {
    answer?: AbTestResponse;
    additionalAnswer?: string;
  };
}

interface DrawingTestPipelineAnswer extends PipelineItemAnswerBase {
  type: 'DrawingTest';
  value: {
    answer?: DrawingTestResponse;
    additionalAnswer?: string;
  };
}

interface FlankerPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Flanker';
  value: {
    answer?: FlankerResponse;
    additionalAnswer?: string;
  };
}

interface SliderPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Slider';
  value: {
    answer?: SliderResponse;
    additionalAnswer?: string;
  };
}

interface NumberSelectPipelineAnswer extends PipelineItemAnswerBase {
  type: 'NumberSelect';
  value: {
    answer?: NumberSelectResponse;
    additionalAnswer?: string;
  };
}

interface CheckboxPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Checkbox';
  value: {
    answer?: CheckboxResponse;
    additionalAnswer?: string;
  };
}

interface AudioPlayerPipelineAnswer extends PipelineItemAnswerBase {
  type: 'AudioPlayer';
  value: {
    answer?: AudioPlayerResponse;
    additionalAnswer?: string;
  };
}

interface TimeRangePipelineAnswer extends PipelineItemAnswerBase {
  type: 'TimeRange';
  value: {
    answer?: TimeRangeResponse;
    additionalAnswer?: string;
  };
}

interface RadioPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Radio';
  value: {
    answer?: RadioResponse;
    additionalAnswer?: string;
  };
}

interface GeolocationPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Geolocation';
  value: {
    answer?: Coordinates;
    additionalAnswer?: string;
  };
}
interface PhotoPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Photo';
  value: {
    answer?: PhotoResponse;
    additionalAnswer?: string;
  };
}

interface VideoPipelineAnswer extends PipelineItemAnswerBase {
  type: 'Video';
  value: {
    answer?: VideoResponse;
    additionalAnswer?: string;
  };
}

export type PipelineItemAnswer =
  | SplashPipelineAnswer
  | TextInputPipelineAnswer
  | AbTestPipelineAnswer
  | DrawingTestPipelineAnswer
  | FlankerPipelineAnswer
  | NumberSelectPipelineAnswer
  | SliderPipelineAnswer
  | RadioPipelineAnswer
  | AudioPlayerPipelineAnswer
  | TimeRangePipelineAnswer
  | GeolocationPipelineAnswer
  | PhotoPipelineAnswer
  | VideoPipelineAnswer
  | CheckboxPipelineAnswer;
