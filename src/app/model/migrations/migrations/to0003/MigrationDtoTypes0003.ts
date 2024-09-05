export type {
  AppletDetailsDto,
  AppletDetailsResponse,
} from '../to0002/MigrationDtoTypes0002';

export type ImageUrl = string;

export type ActivityItemDto = {
  id: string;
  name: string;
  config: unknown;
  question: string;
  responseType: string;
  responseValues: unknown;
  isHidden: boolean;
  order: number;
  timer: number | null;
  conditionalLogic: unknown;
};

export type ActivityDto = {
  id: string;
  name: string;
  description: string;
  splashScreen: ImageUrl | null;
  image: ImageUrl | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  isHidden: boolean;
  responseIsEditable: boolean;
  order: number;
  items: ActivityItemDto[];
  scoresAndReports?: unknown;
};

export type ActivityResponse = {
  result: ActivityDto;
};

export type AppletDto = {
  id: string;
  image: ImageUrl | null;
  displayName: string;
  description: string;
  theme: unknown;
  version: string;
  about: string;
  watermark: ImageUrl | null;
};

export type AppletsResponse = {
  result: AppletDto[];
};
