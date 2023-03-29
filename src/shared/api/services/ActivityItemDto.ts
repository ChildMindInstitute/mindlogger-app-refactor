export type ResponseType =
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
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
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
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
  }>;
};

type TextConfig = ButtonsConfig & {
  maxResponseLength: number;
  correctAnswerRequired: boolean;
  correctAnswer: string;
  numericalResponseRequired: boolean;
  responseDataIdentifier: boolean;
  responseRequired: boolean;
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
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;

    options: Array<{
      id: string;
      text: string;
      image: string | null;
      score: number | null;
      tooltip: string | null;
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
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;

    options: Array<{
      id: string;
      text: string;
      image: string | null;
      score: number | null;
      tooltip: string | null;
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
  minLabel: string | null;
  maxLabel: string | null;
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
  drawingExample: string | null;
  drawingBackground: string | null;
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
  id: string;
  label: string;
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: string | null;
  maxImage: string | null;
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
  id: string;
  name: string;
  config: Config;
  question: string;
  responseType: ResponseType;
  responseValues: ResponseValues;
  order: number;
};

export interface TextItemDto extends ActivityItemDtoBase {
  responseType: 'text';
  config: TextConfig;
  responseValues: TextResponseValues;
}

export interface SingleSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelect';
  config: SingleSelectionConfig;
  responseValues: SingleSelectionResponseValues;
}

export interface MultiSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelect';
  config: MultiSelectionConfig;
  responseValues: MultiSelectionResponseValues;
}

export interface MessageItemDto extends ActivityItemDtoBase {
  responseType: 'message';
  config: MessageConfig;
  responseValues: MessageResponseValues;
}

export interface SliderSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'slider';
  config: SliderConfig;
  responseValues: SliderResponseValue;
}

export interface NumberSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'numberSelect';
  config: NumberSelectionConfig;
  responseValues: NumberSelectionResponseValues;
}

export interface TimeRangeItemDto extends ActivityItemDtoBase {
  responseType: 'timeRange';
  config: TimeRangeConfig;
  responseValues: TimerRangeResponseValues;
}

export interface GeolocationItemDto extends ActivityItemDtoBase {
  responseType: 'geolocation';
  config: GeolocationConfig;
  responseValues: GeolocationResponseValues;
}

export interface DrawingItemDto extends ActivityItemDtoBase {
  responseType: 'drawing';
  config: DrawingConfig;
  responseValues: DrawingResponseValues;
}

export interface PhotoItemDto extends ActivityItemDtoBase {
  responseType: 'photo';
  config: PhotoConfig;
  responseValues: PhotoResponseValues;
}

export interface VideoItemDto extends ActivityItemDtoBase {
  responseType: 'video';
  config: VideoConfig;
  responseValues: VideoResponseValues;
}

export interface DateItemDto extends ActivityItemDtoBase {
  responseType: 'date';
  config: DateConfig;
  responseValues: DateResponseValues;
}

export interface SliderRowsItemDto extends ActivityItemDtoBase {
  responseType: 'sliderRows';
  config: SliderRowsConfig;
  responseValues: SliderRowsResponseValues;
}

export interface SingleSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelectRows';
  config: SingleSelectionRowsConfig;
  responseValues: SingleSelectionRowsResponseValues;
}

export interface MultiSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelectRows';
  config: MultiSelectionRowsConfig;
  responseValues: MultiSelectionRowsResponseValues;
}

export interface AudioItemDto extends ActivityItemDtoBase {
  responseType: 'audio';
  config: AudioConfig;
  responseValues: AudioResponseValues;
}

export interface AudioPlayerItemDto extends ActivityItemDtoBase {
  responseType: 'audioPlayer';
  config: AudioPlayerConfig;
  responseValues: AudioPlayerResponseValues;
}

export interface AbTestItemDto extends ActivityItemDtoBase {
  responseType: 'abTest';
  config: AbTestConfig;
  responseValues: AbTestResponseValues;
}

export interface FlankerItemDto extends ActivityItemDtoBase {
  responseType: 'flanker';
  config: FlankerConfig;
  responseValues: FlankerResponseValues;
}

export type ActivityItemDto =
  | TextItemDto
  | SingleSelectionItemDto
  | MultiSelectionItemDto
  | MessageItemDto
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
