import { CacheManager } from '@georstat/react-native-image-cache';
import { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  AppletAssignmentsResponse,
  AppletDetailsResponse,
  AppletDto,
  IAppletService,
} from '@app/shared/api/services/IAppletService';
import {
  AppletEventsResponse,
  IEventsService,
} from '@app/shared/api/services/IEventsService';
import { toAxiosResponse } from '@app/shared/api/utils';
import { ILogger } from '@app/shared/lib/types/logger';
import { ImageUrl } from '@app/shared/lib/types/url';
import {
  getActivityDetailsKey,
  getAppletBaseInfoKey,
  getAppletDetailsKey,
  getAssignmentsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';
import { IAppletProgressSyncService } from '@entities/applet/model/services/IAppletProgressSyncService';
import { CollectRemoteCompletionsResult } from '@entities/applet/model/services/IProgressDataCollector';
import { IRefreshAppletService } from '@entities/applet/model/services/IRefreshAppletService';
import {
  CollectAllAppletAssignmentsResult,
  CollectAllAppletEventsResult,
  CollectAppletInternalsResult,
  IRefreshDataCollector,
} from '@entities/applet/model/services/IRefreshDataCollector';

import { RefreshDataCollector } from './RefreshDataCollector';
import { RefreshOptimization } from './RefreshOptimization';

export class RefreshAppletService implements IRefreshAppletService {
  private queryClient: QueryClient;
  private logger: ILogger;
  private showWrongUrlLogs: boolean;
  private refreshDataCollector: IRefreshDataCollector;
  private appletProgressSyncService: IAppletProgressSyncService;

  constructor(
    queryClient: QueryClient,
    logger: ILogger,
    appletProgressSyncService: IAppletProgressSyncService,
    appletService: IAppletService,
    eventsService: IEventsService,
  ) {
    this.queryClient = queryClient;
    this.logger = logger;
    this.showWrongUrlLogs = false;
    this.refreshDataCollector = new RefreshDataCollector(
      logger,
      appletService,
      eventsService,
    );
    this.appletProgressSyncService = appletProgressSyncService;
  }

  private isUrlValid = (url: string): boolean => {
    return url.includes('www') || url.includes('http');
  };

  private cacheImages(urls: ImageUrl[]) {
    for (const url of urls) {
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

  private resetAppletBaseInfoQuery(appletId: string) {
    this.queryClient.removeQueries({
      exact: true,
      queryKey: getAppletBaseInfoKey(appletId),
    });
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

  private refreshAssignments(
    appletId: string,
    assignmentsResponse: AxiosResponse<AppletAssignmentsResponse>,
  ) {
    const assignmentsKey = getAssignmentsKey(appletId);
    this.queryClient.setQueryData(assignmentsKey, assignmentsResponse);
  }

  private refreshAppletCaches(
    appletInternalDtos: CollectAppletInternalsResult,
  ) {
    this.resetAppletBaseInfoQuery(appletInternalDtos.appletId);
    this.resetAppletDetailsQuery(appletInternalDtos.appletId);

    for (const activityDto of appletInternalDtos.activities) {
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
    allAppletAssignments: CollectAllAppletAssignmentsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
  ) {
    const appletInternalDtos: CollectAppletInternalsResult =
      await this.refreshDataCollector.collectAppletInternals(appletDto);

    this.refreshAppletCaches(appletInternalDtos);
    this.logger.log(
      `[RefreshAppletService.fullRefresh]: Applet "${appletDto.displayName}|${appletDto.id}" refreshed successfully`,
    );

    const assignmentsResponse =
      allAppletAssignments.appletAssignments[appletDto.id];
    if (!assignmentsResponse) {
      throw new Error('assignmentsResponse is missed');
    }

    this.refreshAssignments(appletDto.id, assignmentsResponse);

    const eventsResponse = allAppletEvents.appletEvents[appletDto.id];
    if (!eventsResponse) {
      throw new Error('eventsResponse is missed');
    }

    this.refreshEvents(appletDto.id, eventsResponse);

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
  }

  private async partialRefresh(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    allAppletAssignments: CollectAllAppletAssignmentsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
  ) {
    this.logger.log(
      `[RefreshAppletService.partialRefresh]: Skip refresh for Applet "${appletDto.displayName}|${appletDto.id}" as to versions are the same`,
    );

    this.resetAppletBaseInfoQuery(appletDto.id);

    const assignmentsResponse =
      allAppletAssignments.appletAssignments[appletDto.id];
    if (!assignmentsResponse) {
      throw new Error('assignmentsResponse is missed');
    }

    this.refreshAssignments(appletDto.id, assignmentsResponse);

    const eventsResponse = allAppletEvents.appletEvents[appletDto.id];
    if (!eventsResponse) {
      throw new Error('eventsResponse is missed');
    }

    this.refreshEvents(appletDto.id, eventsResponse);

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
    );
    if (!appletResponse) {
      this.logger.warn(
        `[RefreshAppletService.partialRefresh]: appletResponse is missed, applet: ${appletDto.displayName}|${appletDto.id}`,
      );
      return;
    }

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
    allAppletAssignments: CollectAllAppletAssignmentsResult,
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
        allAppletAssignments,
        appletRemoteCompletions,
      );
    } else {
      await this.partialRefresh(
        appletDto,
        allAppletEvents,
        allAppletAssignments,
        appletRemoteCompletions,
      );
    }
  }
}
