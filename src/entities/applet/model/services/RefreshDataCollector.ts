import { AxiosResponse } from 'axios';

import {
  ActivityDto,
  AllEventsResponse,
  AppletDetailsDto,
  AppletEventsResponse,
  AppletRespondentMetaDto,
  toAxiosResponse,
  EventsService,
  AppletsService,
  AppletDto,
} from '@app/shared/api';
import {
  ILogger,
  collectActivityDetailsImageUrls,
  collectAppletDetailsImageUrls,
  collectAppletRecordImageUrls,
} from '@app/shared/lib';

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

export interface IRefreshDataCollector {
  collectAppletInternals(appletDto: AppletDto): Promise<CollectAppletInternalsResult>;
  collectAllAppletEvents(currentApplets: string[]): Promise<CollectAllAppletEventsResult>;
}

class RefreshDataCollector implements IRefreshDataCollector {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  private async collectAppletDetails(appletId: string): Promise<CollectAppletDetailsResult> {
    const appletDetailsResponse = await AppletsService.getAppletAndActivitiesDetails({
      appletId,
    });

    const { appletDetail, activitiesDetails, respondentMeta } = appletDetailsResponse.data.result;

    const imageUrls: string[] = collectAppletDetailsImageUrls(appletDetail);

    return {
      appletDetailsDto: appletDetail,
      activityDetailsDtos: activitiesDetails,
      respondentMeta,
      imageUrls,
    };
  }

  private collectActivitiesImages(activityDtos: Array<ActivityDto>): string[] {
    return activityDtos.flatMap((activityDto) => {
      return collectActivityDetailsImageUrls(activityDto);
    });
  }

  public async collectAppletInternals(appletDto: AppletDto): Promise<CollectAppletInternalsResult> {
    const imageUrls: string[] = collectAppletRecordImageUrls(appletDto);

    let collectDetailsResult: CollectAppletDetailsResult;

    try {
      collectDetailsResult = await this.collectAppletDetails(appletDto.id);
    } catch (error) {
      throw new Error(
        `[RefreshDataCollector.collectAppletInternals]: Error occurred during getting applet's details\n\n${error}`,
      );
    }

    const activitiesImages = this.collectActivitiesImages(collectDetailsResult.activityDetailsDtos);

    const allImageUrls = collectDetailsResult.imageUrls.concat(imageUrls, activitiesImages);

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
      return await EventsService.getAllEvents();
    } catch (error) {
      this.logger.warn(`[RefreshDataCollector.collectEvents]: Error occurred while fetching events":\n\n${error}`);

      return null;
    }
  }

  public async collectAllAppletEvents(currentApplets: string[]): Promise<CollectAllAppletEventsResult> {
    const result: CollectAllAppletEventsResult = {
      appletEvents: {},
    };

    const eventsResponse = await this.collectEvents();

    if (eventsResponse) {
      const appletEvents = currentApplets.map((appletId) => ({
        appletId,
        events:
          eventsResponse.data.result.find((appletEventsDto) => appletEventsDto.appletId === appletId)?.events ?? [],
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
}

export default RefreshDataCollector;
