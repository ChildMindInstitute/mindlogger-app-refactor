export type ActivityItemType = 'AbTest' | 'Splash';

type AbTestConfig = {
  device: 'Phone' | 'Tablet';
};

export type ActivityItemConfig = AbTestConfig | null;

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
};

interface AbTestActivityItem extends ActivityItemBase {
  inputType: 'AbTest';
  config: AbTestConfig;
}

interface SplashActivityItem extends ActivityItemBase {
  inputType: 'Splash';
  config: null;
}

export type ActivityItem = AbTestActivityItem | SplashActivityItem;

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
