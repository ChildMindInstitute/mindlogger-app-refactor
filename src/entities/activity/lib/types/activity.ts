export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'NumberSelect'
  | 'Slider'
  | 'Radio'
  | 'Checkbox';

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

export type ActivityItemConfig =
  | AbTestConfig
  | DrawingTestTestConfig
  | TextInputConfig
  | NumberSelectConfig
  | SliderConfig
  | CheckboxConfig
  | RadioConfig
  | SplashConfig
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
interface RadioActivityItem extends ActivityItemBase {
  inputType: 'Radio';
  config: RadioConfig;
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
  | RadioActivityItem;

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
  items: ActivityItem[];
};
