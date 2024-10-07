import type { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  AppletsResponse,
  AppletDto,
  IAppletService,
} from '@app/shared/api/services/IAppletService';
import { IEventsService } from '@app/shared/api/services/IEventsService';
import { onNetworkUnavailable } from '@app/shared/lib/alerts/networkAlert';
import { ILogger } from '@app/shared/lib/types/logger';
import { IMutexDefaultInstanceManager } from '@app/shared/lib/utils/IMutexDefaultInstanceManager';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';
import {
  getAppletsKey,
  getCompletedEntitiesKey,
} from '@app/shared/lib/utils/reactQueryHelpers';
import { IAppletProgressSyncService } from '@entities/applet/model/services/IAppletProgressSyncService';
import {
  CollectRemoteCompletionsResult,
  IProgressDataCollector,
} from '@entities/applet/model/services/IProgressDataCollector';
import { IRefreshAppletService } from '@entities/applet/model/services/IRefreshAppletService';
import {
  CollectAllAppletAssignmentsResult,
  CollectAllAppletEventsResult,
  IRefreshDataCollector,
} from '@entities/applet/model/services/IRefreshDataCollector';

import { ProgressDataCollector } from './ProgressDataCollector';
import { RefreshAppletService } from './RefreshAppletService';
import { RefreshDataCollector } from './RefreshDataCollector';
import { RefreshOptimization } from './RefreshOptimization';
import {
  onAppletListRefreshError,
  onAppletRefreshError,
} from '../../lib/alerts';

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

export class RefreshService implements IRefreshService {
  private queryClient: QueryClient;
  private logger: ILogger;
  private refreshDataCollector: IRefreshDataCollector;
  private progressDataCollector: IProgressDataCollector;
  private refreshAppletService: IRefreshAppletService;
  private appletService: IAppletService;
  private mutexInstanceManager: IMutexDefaultInstanceManager;

  constructor(
    queryClient: QueryClient,
    logger: ILogger,
    appletProgressSyncService: IAppletProgressSyncService,
    appletService: IAppletService,
    eventsService: IEventsService,
    mutexInstanceManager: IMutexDefaultInstanceManager,
  ) {
    this.queryClient = queryClient;
    this.logger = logger;
    this.appletService = appletService;
    this.mutexInstanceManager = mutexInstanceManager;
    this.refreshDataCollector = new RefreshDataCollector(
      logger,
      appletService,
      eventsService,
    );
    this.progressDataCollector = new ProgressDataCollector(logger);
    this.refreshAppletService = new RefreshAppletService(
      queryClient,
      logger,
      appletProgressSyncService,
      appletService,
      eventsService,
    );
  }

  private resetEventsQuery() {
    this.queryClient.removeQueries(['events']);
  }

  private resetAppletListQuery() {
    this.queryClient.removeQueries({
      exact: true,
      queryKey: getAppletsKey(),
    });
  }

  private async invalidateCompletedEntities() {
    await this.queryClient.invalidateQueries({
      queryKey: getCompletedEntitiesKey(),
    });
  }

  private async refreshInternal(): Promise<RefreshResult> {
    const optimization = new RefreshOptimization(this.queryClient);

    optimization.keepExistingAppletVersions();

    this.resetEventsQuery();
    this.resetAppletListQuery();

    const emptyResult = {
      success: false,
      unsuccessfulApplets: [],
    };

    let appletsResponse: AxiosResponse<AppletsResponse>;
    try {
      this.logger.log(
        '[RefreshService.refreshInternal]: Getting flat list of applets',
      );
      appletsResponse = await this.appletService.getApplets();

      this.queryClient.setQueryData(getAppletsKey(), appletsResponse);
    } catch (error) {
      this.logger.warn(
        `[RefreshService.refreshInternal]: Error occurred during refresh flat list of applets:\nInternal error:\n\n${error}`,
      );
      return emptyResult;
    }

    let allAppletAssignments: CollectAllAppletAssignmentsResult;
    try {
      this.logger.log(
        "[RefreshService.refreshInternal]: Getting all applets' assignments",
      );
      allAppletAssignments =
        await this.refreshDataCollector.collectAllAppletAssignments(
          appletsResponse.data.result.map(x => x.id),
        );
    } catch (error) {
      this.logger.log(
        `[RefreshService.refreshInternal]: Error occurred during getting all applet events:\nInternal error:\n\n${error}`,
      );
      return emptyResult;
    }

    let allAppletEvents: CollectAllAppletEventsResult;
    try {
      this.logger.log(
        "[RefreshService.refreshInternal]: Getting all applets' events",
      );
      allAppletEvents = await this.refreshDataCollector.collectAllAppletEvents(
        appletsResponse.data.result.map(x => x.id),
      );
    } catch (error) {
      this.logger.log(
        `[RefreshService.refreshInternal]: Error occurred during getting all applet events:\nInternal error:\n\n${error}`,
      );
      return emptyResult;
    }

    let appletRemoteCompletions: CollectRemoteCompletionsResult;
    try {
      this.logger.log(
        "[RefreshService.refreshInternal]: Getting all applets' remote completions",
      );
      appletRemoteCompletions = await this.progressDataCollector.collect();
    } catch (error) {
      this.logger.log(
        `[RefreshService.refreshInternal]: Error occurred during getting all applets' remote completions:\nInternal error:\n\n${error}`,
      );
      return emptyResult;
    }

    const appletDtos: AppletDto[] = appletsResponse.data.result;

    const unsuccessfulApplets: UnsuccessfulApplet[] = [];

    for (const appletDto of appletDtos) {
      try {
        await this.refreshAppletService.refreshApplet(
          appletDto,
          allAppletEvents,
          allAppletAssignments,
          appletRemoteCompletions,
          optimization,
        );
      } catch (error) {
        this.logger.warn(
          `[RefreshService.refreshInternal]: Error occurred during refresh the applet "${appletDto.displayName}|${appletDto.id}".\nInternal error:\n\n${error}`,
        );
        unsuccessfulApplets.push({
          appletId: appletDto.id,
          appletName: appletDto.displayName,
        });
      }
    }

    this.invalidateCompletedEntities().catch(
      this.logger.error.bind(this.logger),
    );

    this.logger.info('[RefreshService.refreshInternal] Refresh is done');

    return {
      success: unsuccessfulApplets.length === 0,
      unsuccessfulApplets,
    };
  }

  // PUBLIC

  public async refresh() {
    this.logger.log('[RefreshService.refresh]: Started to working');

    const isOnline = await isAppOnline();

    if (!isOnline) {
      this.logger.log(
        '[RefreshService.refresh]: Stopped to work due to Offline',
      );
      await onNetworkUnavailable();
      return;
    }

    if (this.mutexInstanceManager.getRefreshServiceMutex().isBusy()) {
      this.logger.log('[RefreshService.process]: Mutex is busy');
      return;
    }

    try {
      this.mutexInstanceManager.getRefreshServiceMutex().setBusy();

      const refreshResult = await this.refreshInternal();

      if (!refreshResult.success && !refreshResult.unsuccessfulApplets.length) {
        onAppletRefreshError();
      }

      if (!refreshResult.success && refreshResult.unsuccessfulApplets.length) {
        onAppletListRefreshError(
          refreshResult.unsuccessfulApplets.map(x => x.appletName),
        );
      }

      this.logger.log('[RefreshService.refresh]: Completed');
    } catch (error) {
      this.logger.warn(
        `[RefreshService.process]: Error occurred:\nInternal error:\n\n${error}`,
      );
    } finally {
      this.mutexInstanceManager.getRefreshServiceMutex().release();
    }
  }
}
