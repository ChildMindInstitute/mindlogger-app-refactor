import { CacheManager } from '@georstat/react-native-image-cache';
import type { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  ActivityDto,
  ActivityResponse,
  ActivityService,
  AppletDetailsResponse,
  AppletEventsResponse,
  AppletsResponse,
} from '@app/shared/api';
import { EventsService, AppletsService, AppletDto } from '@app/shared/api';
import {
  ILogger,
  IMutex,
  ImageUrl,
  Mutex,
  getActivityDetailsKey,
  getAppletDetailsKey,
  getAppletsKey,
  getCompletedEntitiesKey,
  getEventsKey,
  isAppOnline,
  onNetworkUnavailable,
} from '@app/shared/lib';
import {
  collectActivityDetailsImageUrls,
  collectAppletDetailsImageUrls,
  collectAppletRecordImageUrls,
} from '@app/shared/lib';

import { onAppletListRefreshError, onAppletRefreshError } from '../../lib';

type CollectAppletInternalsResult = {
  appletId: string;
  appletDetailsResponse: AxiosResponse<AppletDetailsResponse>;
  eventsResponse: AxiosResponse<AppletEventsResponse>;
  activities: CollectActivityDetailsResult[];
  imageUrls: string[];
};

type CollectActivityDetailsResult = {
  imageUrls: string[];
  activityDetailsResponse: AxiosResponse<ActivityResponse>;
};

type UnsuccessfulApplet = {
  appletId: string;
  appletName: string;
};

type RefreshResult = {
  success: boolean;
  unsuccessfulApplets: Array<UnsuccessfulApplet>;
};

interface IRefreshService {
  refresh(): void;
}

class RefreshService implements IRefreshService {
  private queryClient: QueryClient;
  private showWrongUrlLogs: boolean;
  private logger: ILogger;
  private static mutex: IMutex = Mutex();

  constructor(queryClient: QueryClient, logger: ILogger) {
    this.queryClient = queryClient;
    this.showWrongUrlLogs = false;
    this.logger = logger;
  }

  private async resetAllQueries() {
    await this.queryClient.removeQueries(['applets']);
    await this.queryClient.removeQueries(['events']);
    await this.queryClient.removeQueries(['activities']);
  }

  private async invalidateCompletedEntities() {
    await this.queryClient.invalidateQueries({
      queryKey: getCompletedEntitiesKey(),
    });
  }

  private isUrlValid = (url: string): boolean => {
    return url.includes('www') || url.includes('http');
  };

  private cacheImages(urls: ImageUrl[]) {
    for (let url of urls) {
      try {
        if (!this.isUrlValid(url)) {
          continue;
        }
        CacheManager.prefetch(url);
      } catch (err) {
        this.showWrongUrlLogs &&
          this.logger.info(
            '[RefreshService.cacheImages] Ignored due to error: url: ' + url,
          );
      }
    }
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
    } catch {
      return Promise.resolve(null);
    }
  }

  private async collectAppletDetails(
    appletDto: AppletDto,
  ): Promise<CollectAppletInternalsResult> {
    const appletId = appletDto.id;

    const appletDetailsResponse = await AppletsService.getAppletDetails({
      appletId,
    });

    const appletDetailsDto = appletDetailsResponse.data.result;

    const imageUrls: string[] = collectAppletDetailsImageUrls(appletDetailsDto);

    const eventsResponse = await EventsService.getEvents({ appletId });

    return {
      appletId: appletDto.id,
      appletDetailsResponse,
      eventsResponse,
      imageUrls,
      activities: [],
    };
  }

  private async collectAppletInternals(
    appletDto: AppletDto,
  ): Promise<CollectAppletInternalsResult> {
    const imageUrls: string[] = collectAppletRecordImageUrls(appletDto);

    let collectResult: CollectAppletInternalsResult;

    try {
      collectResult = await this.collectAppletDetails(appletDto);
    } catch (error) {
      throw new Error(
        `[RefreshService.refreshApplet] Error occurred during getting applet's "${appletDto.displayName}" details or events`,
      );
    }

    collectResult.imageUrls = collectResult.imageUrls.concat(imageUrls);

    const appletDetailsDto = collectResult.appletDetailsResponse.data.result;

    const activityIds: string[] = appletDetailsDto.activities.map(x => x.id);

    const promises: Promise<CollectActivityDetailsResult | null>[] = [];

    for (let activityId of activityIds) {
      const promise = this.collectActivityDetails(activityId);
      promises.push(promise);
    }

    const collectActivityResults = await Promise.all(promises);

    if (collectActivityResults.some(x => x === null)) {
      throw new Error(
        `[RefreshService.refreshApplet] Error occurred during getting applet' "${appletDto.displayName}" activities`,
      );
    }

    collectResult.activities = collectActivityResults.map(x => x!);

    return collectResult;
  }

  private refreshApplet(appletInternalDtos: CollectAppletInternalsResult) {
    for (let activity of appletInternalDtos.activities) {
      const activityDto = activity.activityDetailsResponse.data.result;
      const activityKey = getActivityDetailsKey(activityDto.id);

      this.queryClient.setQueryData(
        activityKey,
        activity.activityDetailsResponse,
      );

      this.cacheImages(activity.imageUrls);
    }

    const appletDetailsKey = getAppletDetailsKey(appletInternalDtos.appletId);

    this.queryClient.setQueryData(
      appletDetailsKey,
      appletInternalDtos.appletDetailsResponse,
    );

    const eventsKey = getEventsKey(appletInternalDtos.appletId);

    this.queryClient.setQueryData(eventsKey, appletInternalDtos.eventsResponse);

    this.cacheImages(appletInternalDtos.imageUrls);
  }

  private async refreshAllApplets(): Promise<RefreshResult> {
    await this.resetAllQueries();

    let appletsResponse: AxiosResponse<AppletsResponse>;

    try {
      appletsResponse = await AppletsService.getApplets();

      this.queryClient.setQueryData(getAppletsKey(), appletsResponse);
    } catch (error) {
      this.logger.warn(
        '[RefreshService.refreshAllApplets]: Error occurred during refresh flat list of applets',
      );
      return {
        success: false,
        unsuccessfulApplets: [],
      };
    }

    const appletDtos: AppletDto[] = appletsResponse.data.result;

    const unsuccessfulApplets: UnsuccessfulApplet[] = [];

    for (let appletDto of appletDtos) {
      try {
        const appletInternalDtos: CollectAppletInternalsResult =
          await this.collectAppletInternals(appletDto);

        this.refreshApplet(appletInternalDtos);

        this.logger.log(
          `[RefreshService.refreshAllApplets]: Applet "${appletDto.displayName}|${appletDto.id}" refreshed successfully`,
        );
      } catch (error) {
        this.logger.warn(
          `[RefreshService.refreshAllApplets]: Error occurred during refresh the applet "${appletDto.displayName}|${appletDto.id}".\nInternal error:\n\n` +
            error!.toString(),
        );
        unsuccessfulApplets.push({
          appletId: appletDto.id,
          appletName: appletDto.displayName,
        });
      }
    }

    this.invalidateCompletedEntities();

    return {
      success: unsuccessfulApplets.length === 0,
      unsuccessfulApplets,
    };
  }

  // PUBLIC

  public static isBusy() {
    return RefreshService.mutex.isBusy();
  }

  public async refresh() {
    const isOnline = await isAppOnline();

    if (!isOnline) {
      await onNetworkUnavailable();
      return;
    }

    if (RefreshService.mutex.isBusy()) {
      this.logger.log('[RefreshService.process]: Mutex is busy');
      return;
    }

    try {
      RefreshService.mutex.setBusy();

      const refreshResult = await this.refreshAllApplets();

      if (!refreshResult.success && !refreshResult.unsuccessfulApplets.length) {
        onAppletRefreshError();
      }

      if (!refreshResult.success && refreshResult.unsuccessfulApplets.length) {
        onAppletListRefreshError(
          refreshResult.unsuccessfulApplets.map(x => x.appletName),
        );
      }
    } catch (error) {
      this.logger.warn(
        '[RefreshService.process]: Error occurred:\nInternal error:\n\n' +
          error!.toString(),
      );
    } finally {
      RefreshService.mutex.release();
    }
  }
}

export default RefreshService;
