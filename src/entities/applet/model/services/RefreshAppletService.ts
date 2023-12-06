import { CacheManager } from '@georstat/react-native-image-cache';
import { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  AppletDetailsResponse,
  AppletDto,
  AppletEventsResponse,
  toAxiosResponse,
} from '@app/shared/api';
import {
  ILogger,
  ImageUrl,
  getActivityDetailsKey,
  getAppletDetailsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

import { CollectRemoteCompletionsResult } from './ProgressDataCollector';
import { IAppletProgressSyncService } from './ProgressSyncService';
import RefreshDataCollector, {
  CollectAllAppletEventsResult,
  CollectAppletInternalsResult,
  IRefreshDataCollector,
} from './RefreshDataCollector';
import RefreshOptimization from './RefreshOptimization';
import type { AppletIntegrationsService } from '../integrations';

export interface IRefreshAppletService {
  refreshApplet(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
    optimization: RefreshOptimization,
  ): Promise<void>;
}

class RefreshAppletService implements IRefreshAppletService {
  private queryClient: QueryClient;
  private logger: ILogger;
  private showWrongUrlLogs: boolean;
  private refreshDataCollector: IRefreshDataCollector;
  private appletProgressSyncService: IAppletProgressSyncService;
  private appletIntegrationService: AppletIntegrationsService;

  constructor(
    queryClient: QueryClient,
    logger: ILogger,
    appletProgressSyncService: IAppletProgressSyncService,
    appletIntegrationService: AppletIntegrationsService,
  ) {
    this.queryClient = queryClient;
    this.logger = logger;
    this.showWrongUrlLogs = false;
    this.refreshDataCollector = new RefreshDataCollector(logger);
    this.appletProgressSyncService = appletProgressSyncService;
    this.appletIntegrationService = appletIntegrationService;
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

  private resetAppletDetailsQuery(appletId: string) {
    this.queryClient.removeQueries({
      exact: true,
      queryKey: getAppletDetailsKey(appletId),
    });
  }

  private resetActivityDetailsQuery(activityId: string) {
    this.queryClient.removeQueries({
      exact: true,
      queryKey: getActivityDetailsKey(activityId),
    });
  }

  private refreshEvents(
    appletId: string,
    eventsResponse: AxiosResponse<AppletEventsResponse>,
  ) {
    const eventsKey = getEventsKey(appletId);

    this.queryClient.setQueryData(eventsKey, eventsResponse);
  }

  private refreshAppletCaches(
    appletInternalDtos: CollectAppletInternalsResult,
  ) {
    this.resetAppletDetailsQuery(appletInternalDtos.appletId);

    for (let activityDto of appletInternalDtos.activities) {
      this.resetActivityDetailsQuery(activityDto.id);

      const activityKey = getActivityDetailsKey(activityDto.id);

      this.queryClient.setQueryData(
        activityKey,
        toAxiosResponse({
          result: activityDto,
        }),
      );
    }

    const appletDetailsKey = getAppletDetailsKey(appletInternalDtos.appletId);

    this.queryClient.setQueryData(
      appletDetailsKey,
      toAxiosResponse({
        result: appletInternalDtos.appletDetails,
        respondentMeta: appletInternalDtos.respondentMeta,
      }),
    );

    this.cacheImages(appletInternalDtos.imageUrls);
  }

  private async fullRefresh(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
  ) {
    const appletInternalDtos: CollectAppletInternalsResult =
      await this.refreshDataCollector.collectAppletInternals(appletDto);

    this.refreshAppletCaches(appletInternalDtos);

    const eventsResponse = allAppletEvents.appletEvents[appletDto.id];

    if (!eventsResponse) {
      throw new Error('eventsResponse is missed');
    }

    this.refreshEvents(appletDto.id, eventsResponse);

    this.logger.log(
      `[RefreshAppletService.fullRefresh]: Applet "${appletDto.displayName}|${appletDto.id}" refreshed successfully`,
    );

    const appletCompletions =
      appletRemoteCompletions.appletEntities[appletDto.id];

    if (!appletCompletions) {
      this.logger.warn(
        `[RefreshAppletService.fullRefresh]: appletCompletions is missed, applet: ${appletDto.displayName}|${appletDto.id}`,
      );
      return;
    }

    await this.appletProgressSyncService.sync(
      appletInternalDtos.appletDetails,
      appletCompletions,
    );

    this.appletIntegrationService.applyIntegrations(
      appletInternalDtos.appletDetails,
    );
  }

  private async partialRefresh(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
  ) {
    const eventsResponse = allAppletEvents.appletEvents[appletDto.id];

    if (!eventsResponse) {
      throw new Error('eventsResponse is missed');
    }

    this.refreshEvents(appletDto.id, eventsResponse);

    this.logger.log(
      `[RefreshAppletService.partialRefresh]: Skip refresh for Applet "${appletDto.displayName}|${appletDto.id}" as to versions are the same`,
    );

    const appletCompletions =
      appletRemoteCompletions.appletEntities[appletDto.id];

    if (!appletCompletions) {
      this.logger.warn(
        `[RefreshAppletService.partialRefresh]: appletCompletions is missed, applet: ${appletDto.displayName}|${appletDto.id}`,
      );
      return;
    }

    const appletResponse = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletDto.id),
      this.queryClient,
    )!;

    await this.appletProgressSyncService.sync(
      appletResponse.result,
      appletCompletions,
    );
  }

  private isAppletDataExist(appletId: string): boolean {
    const appletResponse = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      this.queryClient,
    );
    return !!appletResponse;
  }

  public async refreshApplet(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
    optimization: RefreshOptimization,
  ) {
    if (
      optimization.shouldBeFullyUpdated(appletDto) ||
      !this.isAppletDataExist(appletDto.id)
    ) {
      await this.fullRefresh(
        appletDto,
        allAppletEvents,
        appletRemoteCompletions,
      );
    } else {
      await this.partialRefresh(
        appletDto,
        allAppletEvents,
        appletRemoteCompletions,
      );
    }
  }
}

export default RefreshAppletService;
