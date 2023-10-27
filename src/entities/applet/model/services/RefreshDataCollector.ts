import { AxiosResponse } from 'axios';

import { IdName } from '@app/abstract/lib';
import {
  ActivityDto,
  ActivityResponse,
  ActivityService,
  AppletDetailsResponse,
  AppletEventsResponse,
} from '@app/shared/api';
import { EventsService, AppletsService, AppletDto } from '@app/shared/api';
import {
  ILogger,
  collectActivityDetailsImageUrls,
  collectAppletDetailsImageUrls,
  collectAppletRecordImageUrls,
  splitArrayToBulks,
} from '@app/shared/lib';

type AppletId = string;

export type CollectAppletInternalsResult = {
  appletId: AppletId;
  appletDetailsResponse: AxiosResponse<AppletDetailsResponse>;
  activities: CollectActivityDetailsResult[];
  imageUrls: string[];
};

export type CollectAppletEventsResult = {
  appletId: AppletId;
  eventsResponse: AxiosResponse<AppletEventsResponse>;
};

export type CollectActivityDetailsResult = {
  imageUrls: string[];
  activityDetailsResponse: AxiosResponse<ActivityResponse>;
};

export type CollectAllAppletEventsResult = {
  appletEvents: Record<AppletId, AxiosResponse<AppletEventsResponse> | null>;
};

type CollectAppletDetailsResult = {
  appletDetailsResponse: AxiosResponse<AppletDetailsResponse>;
  imageUrls: string[];
};

export interface IRefreshDataCollector {
  collectAppletInternals(
    appletDto: AppletDto,
  ): Promise<CollectAppletInternalsResult>;
  collectAllAppletEvents(
    applets: IdName[],
  ): Promise<CollectAllAppletEventsResult>;
}

const EventBulkSize = 10;
const ActivityBulkSize = 10;

class RefreshDataCollector implements IRefreshDataCollector {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  private async collectActivityDetails(
    activityId: string,
  ): Promise<CollectActivityDetailsResult | null> {
    try {
      const activityDetailsResponse = await ActivityService.getById(activityId);

      const activityDto: ActivityDto = activityDetailsResponse.data.result;

      const imageUrls: string[] = collectActivityDetailsImageUrls(activityDto);

      return {
        activityDetailsResponse,
        imageUrls,
      };
    } catch (error) {
      this.logger.log(
        `[RefreshDataCollector.collectActivityDetails]: Get activity "${activityId}" details caused error:\n\n` +
          error,
      );
      return null;
    }
  }

  private async collectAppletDetails(
    appletId: string,
  ): Promise<CollectAppletDetailsResult> {
    const appletDetailsResponse = await AppletsService.getAppletDetails({
      appletId,
    });

    const appletDetailsDto = appletDetailsResponse.data.result;

    const imageUrls: string[] = collectAppletDetailsImageUrls(appletDetailsDto);

    return {
      appletDetailsResponse,
      imageUrls,
    };
  }

  private async collectActivities(
    activityIds: string[],
  ): Promise<Array<CollectActivityDetailsResult | null>> {
    const collectActivityResults: Array<CollectActivityDetailsResult | null> =
      [];

    const activityIdsArrays: string[][] = splitArrayToBulks(
      ActivityBulkSize,
      activityIds,
    );

    for (let activityIdsArray of activityIdsArrays) {
      const promises: Promise<CollectActivityDetailsResult | null>[] = [];

      for (let activityId of activityIdsArray) {
        const promise = this.collectActivityDetails(activityId);
        promises.push(promise);
      }
      const bulkResult = await Promise.all(promises);

      collectActivityResults.push(...bulkResult);
    }
    return collectActivityResults;
  }

  public async collectAppletInternals(
    appletDto: AppletDto,
  ): Promise<CollectAppletInternalsResult> {
    const imageUrls: string[] = collectAppletRecordImageUrls(appletDto);

    const collectResult = {
      appletId: appletDto.id,
    } as CollectAppletInternalsResult;

    let collectDetailsResult: CollectAppletDetailsResult;

    try {
      collectDetailsResult = await this.collectAppletDetails(appletDto.id);
    } catch (error) {
      throw new Error(
        "[RefreshDataCollector.collectAppletInternals]: Error occurred during getting applet's details\n\n" +
          error,
      );
    }

    collectResult.appletDetailsResponse =
      collectDetailsResult.appletDetailsResponse;

    collectResult.imageUrls = collectDetailsResult.imageUrls.concat(imageUrls);

    const appletDetailsDto = collectResult.appletDetailsResponse.data.result;

    const activityIds = appletDetailsDto.activities.map(x => x.id);

    const collectActivityResults: Array<CollectActivityDetailsResult | null> =
      await this.collectActivities(activityIds);

    if (collectActivityResults.some(x => x == null)) {
      throw new Error(
        "[RefreshDataCollector.collectAppletInternals]: Error occurred during getting applet's activities",
      );
    }

    collectResult.activities = collectActivityResults.map(x => x!);

    return collectResult;
  }

  private async collectEvents(applet: IdName): Promise<{
    appletId: string;
    response: AxiosResponse<AppletEventsResponse> | null;
  }> {
    try {
      const response = await EventsService.getEvents({ appletId: applet.id });
      return {
        response,
        appletId: applet.id,
      };
    } catch (error) {
      console.warn(
        `[RefreshDataCollector.collectEvents]: Error occurred for applet "${applet.name}|${applet.id}":\n\n` +
          error,
      );
      return {
        appletId: applet.id,
        response: null,
      };
    }
  }

  public async collectAllAppletEvents(
    applets: Array<IdName>,
  ): Promise<CollectAllAppletEventsResult> {
    const result: CollectAllAppletEventsResult = {
      appletEvents: {},
    };

    const appletArrays: IdName[][] = splitArrayToBulks(EventBulkSize, applets);

    for (let appletsArray of appletArrays) {
      const promises = [];

      for (let applet of appletsArray) {
        promises.push(this.collectEvents(applet));
      }

      const bulkResults = await Promise.all(promises);

      bulkResults.forEach(r => {
        result.appletEvents[r.appletId] = r.response;
      });
    }

    return result;
  }
}

export default RefreshDataCollector;
