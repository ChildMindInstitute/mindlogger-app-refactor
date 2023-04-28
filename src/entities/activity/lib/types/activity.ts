export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'NumberSelect'
  | 'Slider'
  | 'Radio'
  | 'Geolocation'
  | 'TimeRange'
  | 'AudioPlayer'
  | 'Message'
  | 'Audio'
  | 'Photo'
  | 'Video'
  | 'Checkbox'
  | 'Date';

type AbTestConfig = {
  device: 'Phone' | 'Tablet';
};

type DrawingTestTestConfig = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};

type TextInputConfig = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
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

type MessageConfig = null;

type AudioConfig = {
  maxDuration: number;
};

type AudioPlayerConfig = {
  file: string;
  playOnce: boolean;
};

type RadioConfig = {
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

type PhotoConfig = null;

type VideoConfig = null;

export type ActivityItemConfig =
  | AbTestConfig
  | DrawingTestTestConfig
  | TextInputConfig
  | NumberSelectConfig
  | SliderConfig
  | CheckboxConfig
  | MessageConfig
  | AudioConfig
  | AudioPlayerConfig
  | RadioConfig
  | SplashConfig
  | PhotoConfig
  | VideoConfig
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
};

interface AbTestActivityItem extends ActivityItemBase {
  inputType: 'AbTest';
  config: AbTestConfig;
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
  config: any;
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

export type ActivityItem =
  | AbTestActivityItem
  | SplashActivityItem
  | DrawingTestTestActivityItem
  | TextInputActivityItem
  | FlankerActivityItem
  | NumberSelectActivityItem
  | SliderActivityItem
  | CheckboxActivityItem
  | GeolocationActivityItem
  | AudioActivityItem
  | MessageActivityItem
  | AudioPlayerActivityItem
  | TimeRangeActivityItem
  | RadioActivityItem
  | DateActivityItem
  | PhotoActivityItem
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
};
