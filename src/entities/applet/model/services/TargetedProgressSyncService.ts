import { QueryClient } from '@tanstack/react-query';

import { getDefaultEventsService } from '@app/shared/api/services/eventsServiceInstance';
import { AppletDetailsDto } from '@app/shared/api/services/IAppletService';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { ILogger } from '@app/shared/lib/types/logger';
import { getMonthAgoDate } from '@app/shared/lib/utils/dateTime';
import { getAppletCompletedEntitiesKey } from '@app/shared/lib/utils/reactQueryHelpers';

import { ITargetedProgressSyncService } from './ITargetedProgressSyncService';
import { ProgressSyncService } from './ProgressSyncService';

export class TargetedProgressSyncService
  implements ITargetedProgressSyncService
{
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;
  private queryClient: QueryClient;
  private queryDataUtils: QueryDataUtils;
  private progressSyncService: ProgressSyncService;

  constructor(
    state: RootState,
    dispatch: AppDispatch,
    logger: ILogger,
    queryClient: QueryClient,
  ) {
    this.state = state;
    this.dispatch = dispatch;
    this.logger = logger;
    this.queryClient = queryClient;
    this.queryDataUtils = new QueryDataUtils(queryClient);
    this.progressSyncService = new ProgressSyncService(
      state,
      dispatch,
      logger,
      queryClient,
    );
  }

  async syncAppletProgress(appletId: string): Promise<void> {
    const methodName = '[TargetedProgressSyncService.syncAppletProgress]';

    try {
      this.logger.log(`${methodName}: Starting sync for ${appletId}`);

      // Fetch completions for this applet only
      const fromDate = getMonthAgoDate();
      const response =
        await getDefaultEventsService().getAppletCompletedEntities({
          appletId,
          fromDate,
          includeInProgress: true,
        });

      this.logger.log(
        `${methodName}: Fetched completions for ${appletId} - ` +
          `${response.data.result.activities.length} activities, ` +
          `${response.data.result.activityFlows.length} flows`,
      );

      // Get applet details from cache
      const appletDetails = this.getAppletDetailsFromCache(appletId);

      if (!appletDetails) {
        this.logger.warn(
          `${methodName}: No cached applet details for ${appletId}, skipping sync`,
        );
        return;
      }

      // Sync progressions to Redux state
      await this.progressSyncService.sync(appletDetails, response.data.result);

      // Update React Query cache for this applet
      this.queryClient.setQueryData(
        getAppletCompletedEntitiesKey(appletId),
        response,
      );

      this.logger.log(
        `${methodName}: Successfully synced progressions for ${appletId}`,
      );
    } catch (error) {
      this.logger.warn(
        `${methodName}: Error syncing ${appletId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      // Don't throw - failing to sync shouldn't break the UI
    }
  }

  private getAppletDetailsFromCache(appletId: string): AppletDetailsDto | null {
    const cached = this.queryDataUtils.getAppletDto(appletId);

    if (!cached) {
      this.logger.warn(
        `[TargetedProgressSyncService.getAppletDetailsFromCache]: ` +
          `Applet ${appletId} not found in cache`,
      );
    }

    return cached;
  }
}
