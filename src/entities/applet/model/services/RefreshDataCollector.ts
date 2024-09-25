import { AxiosResponse } from 'axios';

import { ActivityDto } from '@app/shared/api/services/IActivityService';
import {
  AppletAssignmentsResponse,
  AppletDetailsDto,
  AppletDto,
  AppletRespondentMetaDto,
  IAppletService,
} from '@app/shared/api/services/IAppletService';
import {
  AllEventsResponse,
  AppletEventsResponse,
  IEventsService,
} from '@app/shared/api/services/IEventsService';
import { toAxiosResponse } from '@app/shared/api/utils';
import {
  collectAppletDetailsImageUrls,
  collectActivityDetailsImageUrls,
  collectAppletRecordImageUrls,
} from '@app/shared/lib/services/collectImageUrls';
import { ILogger } from '@app/shared/lib/types/logger';

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

type CollectAppletDetailsResult = {
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

export class RefreshDataCollector implements IRefreshDataCollector {
  private logger: ILogger;

  private appletService: IAppletService;

  private eventsService: IEventsService;

  constructor(
    logger: ILogger,
    appletService: IAppletService,
    eventsService: IEventsService,
  ) {
    this.logger = logger;
    this.appletService = appletService;
    this.eventsService = eventsService;
  }

  private async collectAppletDetails(
    appletId: string,
  ): Promise<CollectAppletDetailsResult> {
    const appletDetailsResponse =
      await this.appletService.getAppletAndActivitiesDetails({
        appletId,
      });

    const { appletDetail, activitiesDetails, respondentMeta } =
      appletDetailsResponse.data.result;

    const imageUrls: string[] = collectAppletDetailsImageUrls(appletDetail);

    return {
      appletDetailsDto: appletDetail,
      activityDetailsDtos: activitiesDetails,
      respondentMeta,
      imageUrls,
    };
  }

  private collectActivitiesImages(activityDtos: Array<ActivityDto>): string[] {
    return activityDtos.flatMap(activityDto => {
      return collectActivityDetailsImageUrls(activityDto);
    });
  }

  public async collectAppletInternals(appletDto: AppletDto) {
    const imageUrls: string[] = collectAppletRecordImageUrls(appletDto);

    let collectDetailsResult: CollectAppletDetailsResult;

    try {
      collectDetailsResult = await this.collectAppletDetails(appletDto.id);
    } catch (error) {
      throw new Error(
        `[RefreshDataCollector.collectAppletInternals]: Error occurred during getting applet's details\n\n${error as never}`,
      );
    }

    const activitiesImages = this.collectActivitiesImages(
      collectDetailsResult.activityDetailsDtos,
    );

    const allImageUrls = collectDetailsResult.imageUrls.concat(
      imageUrls,
      activitiesImages,
    );

    const collectResult: CollectAppletInternalsResult = {
      appletId: appletDto.id,
      appletDetails: collectDetailsResult.appletDetailsDto,
      activities: collectDetailsResult.activityDetailsDtos,
      imageUrls: allImageUrls,
      respondentMeta: collectDetailsResult.respondentMeta,
    };

    return collectResult;
  }

  private async collectEvents(): Promise<AxiosResponse<AllEventsResponse> | null> {
    try {
      return await this.eventsService.getAllEvents();
    } catch (error) {
      this.logger.warn(
        `[RefreshDataCollector.collectEvents]: Error occurred while fetching events":\n\n${error as never}`,
      );

      return null;
    }
  }

  public async collectAllAppletEvents(appletIds: string[]) {
    const result: CollectAllAppletEventsResult = {
      appletEvents: {},
    };

    const eventsResponse = await this.collectEvents();

    if (eventsResponse) {
      const appletEvents = appletIds.map(appletId => ({
        appletId,
        events:
          eventsResponse.data.result.find(
            appletEventsDto => appletEventsDto.appletId === appletId,
          )?.events ?? [],
      }));

      appletEvents.forEach(({ appletId, events }) => {
        result.appletEvents[appletId] = toAxiosResponse({
          result: {
            events,
          },
        });
      });
    }

    return result;
  }

  public async collectAllAppletAssignments(appletIds: string[]) {
    const result: CollectAllAppletAssignmentsResult = {
      appletAssignments: {},
    };

    for (const appletId of appletIds) {
      const assignmentResponse = await this.appletService.getAppletAssignments({
        appletId,
      });
      result.appletAssignments[appletId] = assignmentResponse;
    }

    return result;
  }
}
