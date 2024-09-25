import { AbPayload } from '@app/abstract/lib/types/abTrails';
import { FlankerItemSettings } from '@app/abstract/lib/types/flanker';

import { Report } from './activityReportSettings';
import { ConditionalLogic } from './conditionalLogic';

export type ActivityItemType =
  | 'StabilityTracker'
  | 'AbTrails'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'ParagraphText'
  | 'NumberSelect'
  | 'Slider'
  | 'Radio'
  | 'Geolocation'
  | 'TimeRange'
  | 'AudioPlayer'
  | 'StackedCheckbox'
  | 'StackedRadio'
  | 'StackedSlider'
  | 'Message'
  | 'Audio'
  | 'Photo'
  | 'Video'
  | 'Checkbox'
  | 'Date'
  | 'Time';

export type StabilityTrackerConfig = {
  lambdaSlope: number;
  durationMinutes: number;
  trialsNumber: number;
  userInputType: 'gyroscope' | 'touch';
  phase: 'practice' | 'test';
};

type DrawingTestTestConfig = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  proportionEnabled: boolean;
};

type TextInputConfig = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
};

type ParagraphTextConfig = {
  maxLength: number;
};

type SliderConfig = {
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
    minValue: number;
    maxValue: number;
    message: string;
  }> | null;
  scores: Array<number>;
};

type NumberSelectConfig = {
  max: number;
  min: number;
};

type SplashConfig = {
  imageUrl: string;
};

type CheckboxConfig = {
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

type MessageConfig = null;

type AudioConfig = {
  maxDuration: number;
};

type AudioPlayerConfig = {
  file: string;
  playOnce: boolean;
};

type StackedCheckboxConfig = {
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
    options: Array<{
      optionId: string;
      score: number;
      alert: {
        message: string;
      } | null;
    }>;
  }>;
};

type StackedRadioConfig = {
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
    options: Array<{
      optionId: string;
      score: number;
      alert: {
        message: string;
      } | null;
    }>;
  }>;
};

type StackedSliderConfig = {
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

type RadioConfig = {
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

type PhotoConfig = null;

type VideoConfig = null;

type TimeConfig = null;

type AbTrailsConfig = AbPayload;

export type ActivityItemConfig =
  | AbTrailsConfig
  | StabilityTrackerConfig
  | DrawingTestTestConfig
  | TextInputConfig
  | ParagraphTextConfig
  | NumberSelectConfig
  | SliderConfig
  | CheckboxConfig
  | MessageConfig
  | AudioConfig
  | AudioPlayerConfig
  | StackedCheckboxConfig
  | StackedSliderConfig
  | RadioConfig
  | SplashConfig
  | PhotoConfig
  | VideoConfig
  | TimeConfig
  | FlankerItemSettings
  | null;

type ActivityItemBase = {
  id: string;
  name?: string;
  inputType: ActivityItemType;
  config: ActivityItemConfig;
  timer: number | null;
  isSkippable: boolean;
  hasAlert: boolean;
  hasScore: boolean;
  isAbleToMoveBack: boolean;
  hasTextResponse: boolean;
  canBeReset: boolean;
  hasTopNavigation: boolean;
  isHidden: boolean;
  order: number;
  question: string;
  validationOptions?: {
    correctAnswer?: string;
  };
  additionalText?: {
    required: boolean;
  };
  conditionalLogic?: ConditionalLogic;
};

interface AbTestActivityItem extends ActivityItemBase {
  inputType: 'AbTrails';
  config: AbTrailsConfig;
}

interface StabilityTrackerActivityItem extends ActivityItemBase {
  inputType: 'StabilityTracker';
  config: StabilityTrackerConfig;
}

interface SplashActivityItem extends ActivityItemBase {
  inputType: 'Splash';
  config: SplashConfig;
}

interface DrawingTestTestActivityItem extends ActivityItemBase {
  inputType: 'DrawingTest';
  config: DrawingTestTestConfig;
}

interface FlankerActivityItem extends ActivityItemBase {
  inputType: 'Flanker';
  config: FlankerItemSettings;
}

interface ParagraphTextActivityItem extends ActivityItemBase {
  inputType: 'ParagraphText';
  config: ParagraphTextConfig;
}

interface TextInputActivityItem extends ActivityItemBase {
  inputType: 'TextInput';
  config: TextInputConfig;
}

interface SliderActivityItem extends ActivityItemBase {
  inputType: 'Slider';
  config: SliderConfig;
}

interface NumberSelectActivityItem extends ActivityItemBase {
  inputType: 'NumberSelect';
  config: NumberSelectConfig;
}

interface CheckboxActivityItem extends ActivityItemBase {
  inputType: 'Checkbox';
  config: CheckboxConfig;
}

interface AudioActivityItem extends ActivityItemBase {
  inputType: 'Audio';
  config: AudioConfig;
}
interface MessageActivityItem extends ActivityItemBase {
  inputType: 'Message';
  config: MessageConfig;
}
interface AudioPlayerActivityItem extends ActivityItemBase {
  inputType: 'AudioPlayer';
  config: AudioPlayerConfig;
}

interface StackedCheckboxActivityItem extends ActivityItemBase {
  inputType: 'StackedCheckbox';
  config: StackedCheckboxConfig;
}

interface StackedRadioActivityItem extends ActivityItemBase {
  inputType: 'StackedRadio';
  config: StackedRadioConfig;
}

interface StackedSliderActivityItem extends ActivityItemBase {
  inputType: 'StackedSlider';
  config: StackedSliderConfig;
}

interface TimeRangeActivityItem extends ActivityItemBase {
  inputType: 'TimeRange';
  config: null;
}

interface RadioActivityItem extends ActivityItemBase {
  inputType: 'Radio';
  config: RadioConfig;
}
interface GeolocationActivityItem extends ActivityItemBase {
  inputType: 'Geolocation';
  config: null;
}

interface DateActivityItem extends ActivityItemBase {
  inputType: 'Date';
  config: null;
}

interface PhotoActivityItem extends ActivityItemBase {
  inputType: 'Photo';
  config: PhotoConfig;
}

interface VideoActivityItem extends ActivityItemBase {
  inputType: 'Video';
  config: VideoConfig;
}

interface TimeActivityItem extends ActivityItemBase {
  inputType: 'Time';
  config: TimeConfig;
}

export type ActivityItem =
  | AbTestActivityItem
  | StabilityTrackerActivityItem
  | SplashActivityItem
  | DrawingTestTestActivityItem
  | TextInputActivityItem
  | ParagraphTextActivityItem
  | FlankerActivityItem
  | NumberSelectActivityItem
  | SliderActivityItem
  | CheckboxActivityItem
  | GeolocationActivityItem
  | AudioActivityItem
  | MessageActivityItem
  | AudioPlayerActivityItem
  | StackedSliderActivityItem
  | StackedCheckboxActivityItem
  | StackedRadioActivityItem
  | TimeRangeActivityItem
  | RadioActivityItem
  | DateActivityItem
  | PhotoActivityItem
  | TimeActivityItem
  | VideoActivityItem;

export type ActivityDetails = {
  id: string;
  name: string;
  description: string;
  splashScreen: string | null;
  image: string | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  order: number;
  isHidden: boolean;
  items: ActivityItem[];
  hasSummary: boolean;
  scoreSettings: Array<Report>;
};
