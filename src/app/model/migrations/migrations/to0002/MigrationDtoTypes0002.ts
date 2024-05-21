import { ImageUrl } from '@app/shared/lib';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: string;
  image: ImageUrl | null;
  order: number;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  order: number;
  activityIds: Array<string>;
};

export type AppletDetailsDto = {
  id: string;
  displayName: string;
  activities: ActivityRecordDto[];
  activityFlows: ActivityFlowRecordDto[];
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
};
