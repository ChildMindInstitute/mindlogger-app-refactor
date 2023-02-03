import { Language } from '../types';

export type ActivityDto = {
  id: number;
  guid: string;
  name: string;
  description: Record<Language, string>;
  image: string;
  isReviewable: boolean;
  isSkippable: boolean;
  ordering: boolean;
  splashScreen: string;
};

export type ActivityFlowDto = {
  id: number;
  guid: string;
  name: string;
  image: string;
  description: Record<Language, string>;
  hideBadge: boolean;
  isSingleReport: boolean;
  ordering: boolean;
  items: Array<{ activityId: number }>;
};

export type AppletDetailsDto = {
  id: number;
  name?: string;
  image: string;
  displayName: string;
  description: Record<Language, string>;
  activities: ActivityDto[];
  activityFlows: ActivityFlowDto[];
};
