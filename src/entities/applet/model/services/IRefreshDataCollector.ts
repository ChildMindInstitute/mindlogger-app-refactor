import { AxiosResponse } from 'axios';

import { ActivityDto } from '@shared/api/services/IActivityService.ts';
import {
  AppletAssignmentsResponse,
  AppletDetailsDto,
  AppletDto,
  AppletRespondentMetaDto,
} from '@shared/api/services/IAppletService.ts';
import { AppletEventsResponse } from '@shared/api/services/IEventsService.ts';

type AppletId = string;

export type CollectAppletInternalsResult = {
  appletId: AppletId;
  appletDetails: AppletDetailsDto;
  activities: Array<ActivityDto>;
  imageUrls: string[];
  respondentMeta: AppletRespondentMetaDto;
};

export type CollectAllAppletEventsResult = {
  appletEvents: Record<AppletId, AxiosResponse<AppletEventsResponse> | null>;
};

export type CollectAppletDetailsResult = {
  appletDetailsDto: AppletDetailsDto;
  activityDetailsDtos: Array<ActivityDto>;
  imageUrls: string[];
  respondentMeta: AppletRespondentMetaDto;
};

export type CollectAllAppletAssignmentsResult = {
  appletAssignments: Record<
    AppletId,
    AxiosResponse<AppletAssignmentsResponse> | null
  >;
};

export interface IRefreshDataCollector {
  collectAppletInternals(
    appletDto: AppletDto,
  ): Promise<CollectAppletInternalsResult>;

  collectAllAppletEvents(
    appletIds: string[],
  ): Promise<CollectAllAppletEventsResult>;

  collectAllAppletAssignments(
    appletIds: string[],
  ): Promise<CollectAllAppletAssignmentsResult>;
}
