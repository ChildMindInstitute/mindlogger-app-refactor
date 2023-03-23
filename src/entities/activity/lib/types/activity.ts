export type ActivityItemType = 'AbTest' | 'DrawingTest' | 'Splash';

type AbTestConfig = {
  device: 'Phone' | 'Tablet';
};

type DrawingTestTestConfig = {
  instruction: string | null;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};

export type ActivityItemConfig = AbTestConfig | DrawingTestTestConfig | null;

type ActivityItemBase = {
  id: number;
  inputType: ActivityItemType;
  config: ActivityItemConfig;
  timer: number;
  isSkippable: true;
  hasAlert: true;
  hasScore: true;
  isAbleToMoveToPrevious: true;
  hasTextResponse: true;
  order: number;
  question?: string;
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

export type ActivityItem =
  | AbTestActivityItem
  | SplashActivityItem
  | DrawingTestTestActivityItem;

export type ActivityDetails = {
  id: string;
  name: string;
  description: string;
  splashScreen: string;
  image: string;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  ordering: number;
  items: ActivityItem[];
};
