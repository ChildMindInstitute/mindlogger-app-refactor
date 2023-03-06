export type ActivityItem = {
  id: number;
  inputType: string;
  config: {};
  timer: number;
  isSkippable: true;
  hasAlert: true;
  hasScore: true;
  isAbleToMoveToPrevious: true;
  hasTextResponse: true;
  ordering: number;
};

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
