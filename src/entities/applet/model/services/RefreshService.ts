import { CacheManager } from '@georstat/react-native-image-cache';
import type { QueryClient } from '@tanstack/react-query';

import { ActivityDto, ActivityService } from '@app/shared/api';
import {
  EventsService,
  AppletsService,
  ActivityRecordDto,
  AppletDto,
} from '@app/shared/api';
import {
  ImageUrl,
  getActivityDetailsKey,
  getAppletDetailsKey,
  getAppletsKey,
  getEventsKey,
  isAppOnline,
  onNetworkUnavailable,
} from '@app/shared/lib';
import {
  collectActivityDetailsImageUrls,
  collectAppletDetailsImageUrls,
  collectAppletRecordImageUrls,
} from '@app/shared/lib';

type AppletActivity = {
  appletId: string;
  activityId: string;
};

class RefreshService {
  private queryClient: QueryClient;
  private showWrongUrlLogs: boolean;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.showWrongUrlLogs = false;
  }

  private async resetAllQueries() {
    await this.queryClient.removeQueries(['applets']);
    await this.queryClient.removeQueries(['events']);
    await this.queryClient.removeQueries(['activities']);
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
          console.warn(
            '[RefreshService.cacheImages] Ignored due to error: url: ' + url,
          );
      }
    }
  }

  private async refreshActivityDetails(activityId: string) {
    try {
      const activityResponse = await ActivityService.getById(activityId);

      const activityKey = getActivityDetailsKey(activityId);

      this.queryClient.setQueryData(activityKey, activityResponse);

      const activityDto: ActivityDto = activityResponse.data.result;

      const imageUrls: string[] = collectActivityDetailsImageUrls(activityDto);

      this.cacheImages(imageUrls);
    } catch {
      return Promise.resolve(null);
    }
  }

  private async refreshAppletDetails(
    appletDto: AppletDto,
  ): Promise<AppletActivity[]> {
    const appletId = appletDto.id;

    const appletDetailsKey = getAppletDetailsKey(appletId);

    const appletDetailsResponse = await AppletsService.getAppletDetails({
      appletId,
    });

    await this.queryClient.setQueryData(
      appletDetailsKey,
      appletDetailsResponse,
    );

    const appletDetailsDto = appletDetailsResponse.data.result;

    const imageUrls: string[] = collectAppletDetailsImageUrls(appletDetailsDto);

    this.cacheImages(imageUrls);

    const eventsResponse = await EventsService.getEvents({ appletId });

    const eventsKey = getEventsKey(appletId);

    this.queryClient.setQueryData(eventsKey, eventsResponse);

    const activityDtos: ActivityRecordDto[] = appletDetailsDto.activities;

    return activityDtos.map<AppletActivity>(x => ({
      appletId,
      activityId: x.id,
    }));
  }

  private async refreshApplet(appletDto: AppletDto) {
    const imageUrls: string[] = collectAppletRecordImageUrls(appletDto);

    this.cacheImages(imageUrls);

    const appletActivities = await this.refreshAppletDetails(appletDto);

    const promises: Promise<any>[] = [];

    for (let appletActivity of appletActivities) {
      const promise = this.refreshActivityDetails(appletActivity.activityId);
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  private async refreshAllApplets() {
    await this.resetAllQueries();

    const appletsResponse = await AppletsService.getApplets();

    this.queryClient.setQueryData(getAppletsKey(), appletsResponse);

    const appletDtos: AppletDto[] = appletsResponse.data.result;

    for (let appletDto of appletDtos) {
      try {
        await this.refreshApplet(appletDto);
      } catch {
        console.error(
          `[RefreshService.refreshAllApplets]: Got an error during refreshing Applet "${appletDto.displayName}"`,
        );
      }
    }
  }

  // PUBLIC

  public async refresh() {
    try {
      const isOnline = await isAppOnline();

      if (!isOnline) {
        return onNetworkUnavailable();
      }

      await this.refreshAllApplets();
    } catch (err) {
      console.error(err);
      throw new Error('Applets refreshed with errors');
    }
  }
}

export default RefreshService;
