import type { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { AppletsResponse } from '@app/shared/api';
import { AppletsService, AppletDto } from '@app/shared/api';
import {
  ILogger,
  IMutex,
  Mutex,
  getAppletsKey,
  getCompletedEntitiesKey,
  isAppOnline,
  onNetworkUnavailable,
} from '@app/shared/lib';

import ProgressDataCollector, {
  CollectRemoteCompletionsResult,
  IProgressDataCollector,
} from './ProgressDataCollector';
import { IAppletProgressSyncService } from './ProgressSyncService';
import RefreshAppletService, {
  IRefreshAppletService,
} from './RefreshAppletService';
import RefreshDataCollector, {
  CollectAllAppletEventsResult,
  IRefreshDataCollector,
} from './RefreshDataCollector';
import RefreshOptimization from './RefreshOptimization';
import { onAppletListRefreshError, onAppletRefreshError } from '../../lib';
import type { AppletIntegrationsService } from '../integrations';

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
  private logger: ILogger;
  private refreshDataCollector: IRefreshDataCollector;
  private progressDataCollector: IProgressDataCollector;
  private refreshAppletService: IRefreshAppletService;
  private static mutex: IMutex = Mutex();

  constructor(
    queryClient: QueryClient,
    logger: ILogger,
    appletProgressSyncService: IAppletProgressSyncService,
    appletIntegrationService: AppletIntegrationsService,
  ) {
    this.queryClient = queryClient;
    this.logger = logger;
    this.refreshDataCollector = new RefreshDataCollector(logger);
    this.progressDataCollector = new ProgressDataCollector(logger);
    this.refreshAppletService = new RefreshAppletService(
      queryClient,
      logger,
      appletProgressSyncService,
      appletIntegrationService,
    );
  }

  private async resetEventsQuery() {
    await this.queryClient.removeQueries(['events']);
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

    await this.resetEventsQuery();

    await this.resetAppletListQuery();

    const emptyResult = {
      success: false,
      unsuccessfulApplets: [],
    };

    let appletsResponse: AxiosResponse<AppletsResponse>;

    try {
      this.logger.log(
        '[RefreshService.refreshInternal]: Getting flat list of applets',
      );
      appletsResponse = await AppletsService.getApplets();

      this.queryClient.setQueryData(getAppletsKey(), appletsResponse);
    } catch (error) {
      this.logger.warn(
        '[RefreshService.refreshInternal]: Error occurred during refresh flat list of applets:\nInternal error:\n\n' +
          error,
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
        '[RefreshService.refreshInternal]: Error occurred during getting all applet events:\nInternal error:\n\n' +
          error,
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
        "[RefreshService.refreshInternal]: Error occurred during getting all applets' remote completions:\nInternal error:\n\n" +
          error,
      );
      return emptyResult;
    }

    const appletDtos: AppletDto[] = appletsResponse.data.result;

    const unsuccessfulApplets: UnsuccessfulApplet[] = [];

    for (let appletDto of appletDtos) {
      try {
        await this.refreshAppletService.refreshApplet(
          appletDto,
          allAppletEvents,
          appletRemoteCompletions,
          optimization,
        );
      } catch (error) {
        this.logger.warn(
          `[RefreshService.refreshInternal]: Error occurred during refresh the applet "${appletDto.displayName}|${appletDto.id}".\nInternal error:\n\n` +
            error,
        );
        unsuccessfulApplets.push({
          appletId: appletDto.id,
          appletName: appletDto.displayName,
        });
      }
    }

    this.invalidateCompletedEntities();

    this.logger.info('[RefreshService.refreshInternal] Refresh is done');

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
    this.logger.log('[RefreshService.refresh]: Started to working');

    const isOnline = await isAppOnline();

    if (!isOnline) {
      this.logger.log(
        '[RefreshService.refresh]: Stopped to work due to Offline',
      );
      await onNetworkUnavailable();
      return;
    }

    if (RefreshService.mutex.isBusy()) {
      this.logger.log('[RefreshService.process]: Mutex is busy');
      return;
    }

    try {
      RefreshService.mutex.setBusy();

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
        '[RefreshService.process]: Error occurred:\nInternal error:\n\n' +
          error!.toString(),
      );
    } finally {
      RefreshService.mutex.release();
    }
  }
}

export default RefreshService;
