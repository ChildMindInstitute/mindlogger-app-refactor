export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput';

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

export type ActivityItemConfig =
  | AbTestConfig
  | DrawingTestTestConfig
  | TextInputConfig
  | null;

type ActivityItemBase = {
  id: string;
  inputType: ActivityItemType;
  config: ActivityItemConfig;
  timer: number | null;
  isSkippable: boolean;
  hasAlert: boolean;
  hasScore: boolean;
  isAbleToMoveToPrevious: boolean;
  hasTextResponse: boolean;
  canBeReset: boolean;
  hasTopNavigation: boolean;
  order: number;
  question: string;
  validationOptions?: {
    correctAnswer?: string;
  };
};

interface AbTestActivityItem extends ActivityItemBase {
  inputType: 'AbTest';
  config: AbTestConfig;
}

interface SplashActivityItem extends ActivityItemBase {
  inputType: 'Splash';
  config: null;
}

interface DrawingTestTestActivityItem extends ActivityItemBase {
  inputType: 'DrawingTest';
  config: DrawingTestTestConfig;
}

interface FlakerActivityItem extends ActivityItemBase {
  inputType: 'Flanker';
  config: any;
}

interface TextInputActivityItem extends ActivityItemBase {
  inputType: 'TextInput';
  config: TextInputConfig;
}

export type ActivityItem =
  | AbTestActivityItem
  | SplashActivityItem
  | DrawingTestTestActivityItem
  | FlakerActivityItem
  | TextInputActivityItem;

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
