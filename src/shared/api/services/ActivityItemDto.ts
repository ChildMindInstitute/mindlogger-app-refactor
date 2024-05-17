import { ImageUrl } from '@app/shared/lib';

import { AbTrailsItemSettingsDto } from './AbTrailsSettingsDtos';
import { FlankerItemSettingsDto } from './FlankerSettingsDto';

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
  | 'stabilityTracker'
  | 'time'
  | 'ABTrails';

type Match = 'any' | 'all';

export type ConditionalLogicDto = {
  match: Match;
  conditions: Array<ConditionDto>;
};

type ConditionDto =
  | IncludesOptionConditionDto
  | NotIncludesOptionConditionDto
  | EqualToOptionConditionDto
  | NotEqualToOptionConditionDto
  | GreaterThanConditionDto
  | LessThanConditionDto
  | EqualConditionDto
  | NotEqualConditionDto
  | BetweenConditionDto
  | OutsideOfConditionDto;

type IncludesOptionConditionDto = {
  itemName: string;
  type: 'INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

type NotIncludesOptionConditionDto = {
  itemName: string;
  type: 'NOT_INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

type EqualToOptionConditionDto = {
  itemName: string;
  type: 'EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
  };
};

type NotEqualToOptionConditionDto = {
  itemName: string;
  type: 'NOT_EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
  };
};

type GreaterThanConditionDto = {
  itemName: string;
  type: 'GREATER_THAN';
  payload: {
    value: number;
  };
};

type LessThanConditionDto = {
  itemName: string;
  type: 'LESS_THAN';
  payload: {
    value: number;
  };
};

type EqualConditionDto = {
  itemName: string;
  type: 'EQUAL';
  payload: {
    value: number;
  };
};

type NotEqualConditionDto = {
  itemName: string;
  type: 'NOT_EQUAL';
  payload: {
    value: number;
  };
};

type BetweenConditionDto = {
  itemName: string;
  type: 'BETWEEN';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

type OutsideOfConditionDto = {
  itemName: string;
  type: 'OUTSIDE_OF';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

type ButtonsConfiguration = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

type TimerConfiguration = {
  timer: number | null;
};

export type AdditionalResponseConfiguration = {
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

type SingleSelectionConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    autoAdvance: boolean;
    setPalette: boolean;
  };

export type DataMatrixDto = Array<{
  rowId: string;
  options: Array<{
    optionId: string;
    score: number;
    alert: string | null;
  }>;
}>;

export type SliderAlertsDto = Array<{
  value: number;
  minValue: number;
  maxValue: number;
  alert: string;
}> | null;

export type SliderRowsDto = Array<{
  id: string;
  label: string;
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: ImageUrl | null;
  maxImage: ImageUrl | null;
  alerts: SliderAlertsDto;
}>;

export type OptionsDto = Array<{
  id: string;
  text: string;
  image: string | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
  value: number;
  alert: string | null;
  isNoneAbove?: boolean;
}>;

type SingleSelectionAnswerSettings = {
  options: OptionsDto;
};

type MultiSelectionConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimeRangeConfiguration & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    setPalette: boolean;
  };

type MultiSelectionAnswerSettings = {
  options: OptionsDto;
};

type TextConfiguration = ButtonsConfiguration &
  TimerConfiguration & {
    maxResponseLength: number;
    correctAnswerRequired: boolean;
    correctAnswer: string;
    numericalResponseRequired: boolean;
    responseDataIdentifier: boolean;
  };

type TextAnswerSettings = null;

type SingleSelectionRowsConfiguration = ButtonsConfiguration &
  TimerConfiguration & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

type SingleSelectionRowsAnswerSettings = {
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: ImageUrl | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: ImageUrl | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrixDto;
};

type MultiSelectionRowsConfiguration = ButtonsConfiguration &
  TimerConfiguration & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    randomizeOptions: boolean;
  };

type MultiSelectionRowsAnswerSettings = {
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: ImageUrl | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: ImageUrl | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrixDto;
};

type AudioConfiguration = ButtonsConfiguration &
  TimerConfiguration &
  AdditionalResponseConfiguration;

type AudioAnswerSettings = {
  maxDuration: number;
};

type AudioPlayerConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration & {
    playOnce: boolean;
  };

type AudioPlayerAnswerSettings = {
  file: string;
};

type MessageConfiguration = Omit<ButtonsConfiguration, 'skippableItem'> &
  TimerConfiguration;

type MessageAnswerSettings = null;

type SliderConfiguration = ButtonsConfiguration &
  TimerConfiguration &
  AdditionalResponseConfiguration & {
    addScores: boolean;
    setAlerts: boolean;
    showTickMarks: boolean;
    showTickLabels: boolean;
    continuousSlider: boolean;
  };

type SliderAnswerSettings = {
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: ImageUrl | null;
  maxImage: ImageUrl | null;
  alerts: SliderAlertsDto;
  scores: Array<number>;
};

type NumberSelectionConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration;

type NumberSelectionAnswerSettings = {
  minValue: number;
  maxValue: number;
};

type TimeRangeConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type TimerRangeAnswerSettings = null;

type GeolocationConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type GeolocationAnswerSettings = null;

type DrawingConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration & {
    removeUndoButton: boolean;
    navigationToTop: boolean;
  };

type DrawingAnswerSettings = {
  drawingExample: string | null;
  drawingBackground: string | null;
  proportion: {
    enabled: boolean;
  } | null;
};

type PhotoConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type PhotoAnswerSettings = null;

type VideoConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type VideoAnswerSettings = null;

type DateConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type TimeConfiguration = ButtonsConfiguration &
  AdditionalResponseConfiguration &
  TimerConfiguration;

type DateAnswerSettings = null;

type TimeAnswerSettings = null;

type SliderRowsConfiguration = ButtonsConfiguration &
  TimerConfiguration & {
    addScores: boolean;
    setAlerts: boolean;
  };

type SliderRowsAnswerSettings = {
  rows: SliderRowsDto;
};

// @todo Change when the BE integration is done
type AbTestConfiguration = TimerConfiguration;

// @todo Change when the BE integration is done
type AbTestAnswerSettings = {
  device: 'Phone' | 'Tablet';
};

export type FlankerConfiguration = FlankerItemSettingsDto;

type StabilityTrackerAnswerSettings = null;

type StabilityTrackerConfiguration = {
  lambdaSlope: number;
  durationMinutes: number;
  trialsNumber: number;
  userInputType: 'gyroscope' | 'touch';
  phase: 'practice' | 'test';
};

export type FlankerAnswerSettings = null;

export type AbTrailsConfiguration = AbTrailsItemSettingsDto;

export type AbTrailsAnswerSettings = null;

type Configuration =
  | TextConfiguration
  | SingleSelectionRowsConfiguration
  | MultiSelectionRowsConfiguration
  | AudioConfiguration
  | AudioPlayerConfiguration
  | MessageConfiguration
  | SliderConfiguration
  | NumberSelectionConfiguration
  | TimeRangeConfiguration
  | GeolocationConfiguration
  | DrawingConfiguration
  | PhotoConfiguration
  | VideoConfiguration
  | DateConfiguration
  | TimeConfiguration
  | SliderRowsConfiguration
  | SingleSelectionConfiguration
  | MultiSelectionConfiguration
  | AbTestConfiguration
  | StabilityTrackerConfiguration
  | FlankerConfiguration
  | AbTrailsConfiguration;

type AnswerSettings =
  | TextAnswerSettings
  | SingleSelectionRowsAnswerSettings
  | MultiSelectionRowsAnswerSettings
  | AudioAnswerSettings
  | AudioPlayerAnswerSettings
  | MessageAnswerSettings
  | SliderAnswerSettings
  | NumberSelectionAnswerSettings
  | TimerRangeAnswerSettings
  | GeolocationAnswerSettings
  | DrawingAnswerSettings
  | PhotoAnswerSettings
  | VideoAnswerSettings
  | DateAnswerSettings
  | SliderRowsAnswerSettings
  | SingleSelectionAnswerSettings
  | MultiSelectionAnswerSettings
  | AbTestAnswerSettings
  | StabilityTrackerAnswerSettings
  | FlankerAnswerSettings
  | AbTrailsAnswerSettings;

type ActivityItemDtoBase = {
  id: string;
  name: string;
  config: Configuration;
  question: string;
  responseType: ResponseType;
  responseValues: AnswerSettings;
  isHidden: boolean;
  order: number;
  timer: number | null;
  conditionalLogic: ConditionalLogicDto | null;
};

export interface TextItemDto extends ActivityItemDtoBase {
  responseType: 'text';
  config: TextConfiguration;
  responseValues: TextAnswerSettings;
}

export interface SingleSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelect';
  config: SingleSelectionConfiguration;
  responseValues: SingleSelectionAnswerSettings;
}

export interface MultiSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelect';
  config: MultiSelectionConfiguration;
  responseValues: MultiSelectionAnswerSettings;
}

export interface MessageItemDto extends ActivityItemDtoBase {
  responseType: 'message';
  config: MessageConfiguration;
  responseValues: MessageAnswerSettings;
}

export interface SliderSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'slider';
  config: SliderConfiguration;
  responseValues: SliderAnswerSettings;
}

export interface NumberSelectionItemDto extends ActivityItemDtoBase {
  responseType: 'numberSelect';
  config: NumberSelectionConfiguration;
  responseValues: NumberSelectionAnswerSettings;
}

export interface TimeRangeItemDto extends ActivityItemDtoBase {
  responseType: 'timeRange';
  config: TimeRangeConfiguration;
  responseValues: TimerRangeAnswerSettings;
}

export interface GeolocationItemDto extends ActivityItemDtoBase {
  responseType: 'geolocation';
  config: GeolocationConfiguration;
  responseValues: GeolocationAnswerSettings;
}

export interface DrawingItemDto extends ActivityItemDtoBase {
  responseType: 'drawing';
  config: DrawingConfiguration;
  responseValues: DrawingAnswerSettings;
}

export interface PhotoItemDto extends ActivityItemDtoBase {
  responseType: 'photo';
  config: PhotoConfiguration;
  responseValues: PhotoAnswerSettings;
}

export interface VideoItemDto extends ActivityItemDtoBase {
  responseType: 'video';
  config: VideoConfiguration;
  responseValues: VideoAnswerSettings;
}

export interface DateItemDto extends ActivityItemDtoBase {
  responseType: 'date';
  config: DateConfiguration;
  responseValues: DateAnswerSettings;
}

export interface TimeItemDto extends ActivityItemDtoBase {
  responseType: 'time';
  config: TimeConfiguration;
  responseValues: TimeAnswerSettings;
}

export interface SliderRowsItemDto extends ActivityItemDtoBase {
  responseType: 'sliderRows';
  config: SliderRowsConfiguration;
  responseValues: SliderRowsAnswerSettings;
}

export interface SingleSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'singleSelectRows';
  config: SingleSelectionRowsConfiguration;
  responseValues: SingleSelectionRowsAnswerSettings;
}

export interface MultiSelectionRowsItemDto extends ActivityItemDtoBase {
  responseType: 'multiSelectRows';
  config: MultiSelectionRowsConfiguration;
  responseValues: MultiSelectionRowsAnswerSettings;
}

export interface AudioItemDto extends ActivityItemDtoBase {
  responseType: 'audio';
  config: AudioConfiguration;
  responseValues: AudioAnswerSettings;
}

export interface AudioPlayerItemDto extends ActivityItemDtoBase {
  responseType: 'audioPlayer';
  config: AudioPlayerConfiguration;
  responseValues: AudioPlayerAnswerSettings;
}

export interface StabilityTrackerItemDto extends ActivityItemDtoBase {
  responseType: 'stabilityTracker';
  config: StabilityTrackerConfiguration;
  responseValues: StabilityTrackerAnswerSettings;
}

export interface FlankerItemDto extends ActivityItemDtoBase {
  responseType: 'flanker';
  config: FlankerConfiguration;
  responseValues: FlankerAnswerSettings;
}

export interface ABTrailsItemDto extends ActivityItemDtoBase {
  responseType: 'ABTrails';
  config: AbTrailsConfiguration;
  responseValues: AbTrailsAnswerSettings;
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
  | ABTrailsItemDto
  | StabilityTrackerItemDto
  | FlankerItemDto
  | TimeItemDto;
