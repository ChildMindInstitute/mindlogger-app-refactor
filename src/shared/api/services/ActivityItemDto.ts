type ResponseType =
  | 'text'
  | 'singleSelect'
  | 'multiSelect'
  | 'message'
  | 'slider'
  | 'numberSelect'
  | 'timeRange'
  | 'geolocation'
  | 'drawing'
  | 'photo'
  | 'video'
  | 'date'
  | 'sliderRows'
  | 'singleSelectRows'
  | 'multiSelectRows'
  | 'audio'
  | 'audioPlayer'
  | 'flanker'
  | 'abTest';

type ButtonsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

type TimerConfig = {
  timer: number | null;
};

type AdditionalResponseConfig = {
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

type SingleSelectionConfig = ButtonsConfig &
  AdditionalResponseConfig &
  TimerConfig & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    setPalette: boolean;
  };

type SingleSelectionResponseValues = {
  options: Array<{
    text: string;
    image: string;
    score: string;
    tooltip: string;
    isHidden: string;
  }>;
};

type MultiSelectionConfig = ButtonsConfig &
  AdditionalResponseConfig &
  TimeRangeConfig & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    setPalette: boolean;
  };

type MultiSelectionResponseValues = {
  options: Array<{
    text: string;
    image: string;
    score: string;
    tooltip: string;
    isHidden: string;
  }>;
};

type TextConfig = ButtonsConfig & {
  maxResponseLength: number;
  correctAnswerRequired: boolean;
  correctAnswer: string;
  numericalResponseRequired: string;
  responseDataIdentifier: string;
  responseRequired: string;
};

type TextResponseValues = null;

type SingleSelectionRowsConfig = ButtonsConfig &
  TimerConfig & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

type SingleSelectionRowsResponseValues = {
  rows: Array<{
    rowName: string;
    rowImage: string;
    tooltip: string;

    options: Array<{
      text: string;
      image: string;
      score: number;
      tooltip: string;
    }>;
  }>;
};

type MultiSelectionRowsConfig = ButtonsConfig &
  TimerConfig & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

type MultiSelectionRowsResponseValues = {
  rows: Array<{
    rowName: string;
    rowImage: string;
    tooltip: string;

    options: Array<{
      text: string;
      image: string;
      score: 0;
      tooltip: string;
    }>;
  }>;
};

type AudioConfig = ButtonsConfig & TimerConfig & AdditionalResponseConfig;

type AudioResponseValues = {
  maxDuration: number;
};

type AudioPlayerConfig = ButtonsConfig &
  AdditionalResponseConfig & {
    playOnce: boolean;
  };

type AudioPlayerResponseValues = {
  file: string;
};

type MessageConfig = Omit<ButtonsConfig, 'skippableItem'> & TimerConfig;

type MessageResponseValues = null;

type SliderConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    addScores: boolean;
    setAlerts: boolean;
    showTickMarks: boolean;
    showTickLabels: boolean;
    continuousSlider: boolean;
  };

type SliderResponseValue = {
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
  minImage: string | null;
  maxImage: string | null;
};

type NumberSelectionConfig = ButtonsConfig & AdditionalResponseConfig;

type NumberSelectionResponseValues = {
  minValue: number;
  maxValue: number;
};

type TimeRangeConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

type TimerRangeResponseValues = null;

type GeolocationConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

type GeolocationResponseValues = null;

type DrawingConfig = ButtonsConfig &
  AdditionalResponseConfig &
  TimerConfig & {
    removeUndoButton: boolean;
    navigationToTop: boolean;
  };

type DrawingResponseValues = {
  drawingExample: string;
  drawingBackground: string;
};

type PhotoConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

type PhotoResponseValues = null;

type VideoConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

type VideoResponseValues = null;

type DateConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

type DateResponseValues = null;

type SliderRowsConfig = ButtonsConfig &
  TimerConfig & {
    addScores: boolean;
    setAlerts: boolean;
  };

type SliderRowsResponseValues = Array<{
  label: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
  minImage: string;
  maxImage: string;
}>;

// @todo Change when the BE integration is done
type AbTestConfig = TimerConfig;

// @todo Change when the BE integration is done
type AbTestResponseValues = {
  device: 'Phone' | 'Tablet';
};

// @todo Change when the BE integration is done
type FlankerConfig = any;

// @todo Change when the BE integration is done
type FlankerResponseValues = any;

type Config =
  | TextConfig
  | SingleSelectionRowsConfig
  | MultiSelectionRowsConfig
  | AudioConfig
  | AudioPlayerConfig
  | MessageConfig
  | SliderConfig
  | NumberSelectionConfig
  | TimeRangeConfig
  | GeolocationConfig
  | DrawingConfig
  | PhotoConfig
  | VideoConfig
  | DateConfig
  | SliderRowsConfig
  | SingleSelectionConfig
  | MultiSelectionConfig
  | AbTestConfig
  | FlankerConfig;

type ResponseValues =
  | TextResponseValues
  | SingleSelectionRowsResponseValues
  | MultiSelectionRowsResponseValues
  | AudioResponseValues
  | AudioPlayerResponseValues
  | MessageResponseValues
  | SliderResponseValue
  | NumberSelectionResponseValues
  | TimerRangeResponseValues
  | GeolocationResponseValues
  | DrawingResponseValues
  | PhotoResponseValues
  | VideoResponseValues
  | DateResponseValues
  | SliderRowsResponseValues
  | SingleSelectionResponseValues
  | MultiSelectionResponseValues
  | AbTestResponseValues
  | FlankerResponseValues;

type ActivityItemDtoBase = {
  id: number;
  name: string;
  config: Config;
  question: string;
  responseType: ResponseType;
  responseValues: ResponseValues;
  order: number;
};

interface TextActivityItemDto extends ActivityItemDtoBase {
  responseType: 'text';
  config: TextConfig;
  responseValues: TextResponseValues;
}

interface SingleSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelect';
  config: SingleSelectionConfig;
  responseValues: SingleSelectionResponseValues;
}

interface MultiSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelect';
  config: MultiSelectionConfig;
  responseValues: MultiSelectionResponseValues;
}

interface MessageSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'message';
  config: MessageConfig;
  responseValues: MessageResponseValues;
}

interface SliderSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'slider';
  config: SliderConfig;
  responseValues: SliderResponseValue;
}

interface NumberSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'numberSelect';
  config: NumberSelectionConfig;
  responseValues: NumberSelectionResponseValues;
}

interface TimeRangeItemDto extends ActivityItemDtoBase {
  responseType: 'timeRange';
  config: TimeRangeConfig;
  responseValues: TimerRangeResponseValues;
}

interface GeolocationItemDto extends ActivityItemDtoBase {
  responseType: 'geolocation';
  config: GeolocationConfig;
  responseValues: GeolocationResponseValues;
}

interface DrawingItemDto extends ActivityItemDtoBase {
  responseType: 'drawing';
  config: DrawingConfig;
  responseValues: DrawingResponseValues;
}

interface PhotoItemDto extends ActivityItemDtoBase {
  responseType: 'photo';
  config: PhotoConfig;
  responseValues: PhotoResponseValues;
}

interface VideoItemDto extends ActivityItemDtoBase {
  responseType: 'video';
  config: VideoConfig;
  responseValues: VideoResponseValues;
}

interface DateItemDto extends ActivityItemDtoBase {
  responseType: 'date';
  config: DateConfig;
  responseValues: DateResponseValues;
}

interface SliderRowsItemDto extends ActivityItemDtoBase {
  responseType: 'sliderRows';
  config: SliderRowsConfig;
  responseValues: SliderRowsResponseValues;
}

interface SingleSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelectRows';
  config: SingleSelectionRowsConfig;
  responseValues: SingleSelectionRowsResponseValues;
}

interface MultiSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelectRows';
  config: MultiSelectionRowsConfig;
  responseValues: MultiSelectionRowsResponseValues;
}

interface AudioItemDto extends ActivityItemDtoBase {
  responseType: 'audio';
  config: AudioConfig;
  responseValues: AudioResponseValues;
}

interface AudioPlayerItemDto extends ActivityItemDtoBase {
  responseType: 'audioPlayer';
  config: AudioPlayerConfig;
  responseValues: AudioPlayerResponseValues;
}

interface AbTestItemDto extends ActivityItemDtoBase {
  responseType: 'abTest';
  config: AbTestConfig;
  responseValues: AbTestResponseValues;
}

interface FlankerItemDto extends ActivityItemDtoBase {
  responseType: 'flanker';
  config: FlankerConfig;
  responseValues: FlankerResponseValues;
}

export type ActivityItemDto =
  | TextActivityItemDto
  | SingleSelectionItemDto
  | MultiSelectionItemDto
  | MessageSelectionItemDto
  | SliderSelectionItemDto
  | NumberSelectionItemDto
  | TimeRangeItemDto
  | GeolocationItemDto
  | DrawingItemDto
  | PhotoItemDto
  | VideoItemDto
  | DateItemDto
  | SliderRowsItemDto
  | SingleSelectionRowsItemDto
  | MultiSelectionRowsItemDto
  | AudioItemDto
  | AudioPlayerItemDto
  | AbTestItemDto
  | FlankerItemDto;
