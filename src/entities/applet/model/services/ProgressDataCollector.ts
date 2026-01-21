import { getDefaultEventsService } from '@app/shared/api/services/eventsServiceInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { getMonthAgoDate } from '@app/shared/lib/utils/dateTime';
import {
  CollectForAppletResult,
  CollectRemoteCompletionsResult,
  IProgressDataCollector,
} from '@entities/applet/model/services/IProgressDataCollector';

export class ProgressDataCollector implements IProgressDataCollector {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  private async collectAllCompletions(): Promise<CollectForAppletResult> {
    const fromDate = getMonthAgoDate();

    return await getDefaultEventsService().getAllCompletedEntities({
      fromDate,
      includeInProgress: true,
    });
  }

  private async collectInternal(): Promise<CollectRemoteCompletionsResult> {
    const result: CollectRemoteCompletionsResult = {
      appletEntities: {},
    };

    const response = await this.collectAllCompletions();

    // Log the full response to debug server data
    this.logger.log(
      `[ProgressDataCollector.collectInternal]: API response: ${JSON.stringify(response?.data?.result)}`,
    );

    response?.data?.result?.forEach(completions => {
      result.appletEntities[completions.id] = completions;
      
      // Log flow completions specifically
      if (completions.activityFlows && completions.activityFlows.length > 0) {
        this.logger.log(
          `[ProgressDataCollector.collectInternal]: Flow completions for applet ${completions.id}: ${JSON.stringify(completions.activityFlows)}`,
        );
      }
    });

    return result;
  }

  public async collect(): Promise<CollectRemoteCompletionsResult> {
    try {
      return await this.collectInternal();
    } catch (error) {
      this.logger.warn(
        `[ProgressDataCollector.collect]: Error occurred during collect remotely completed entities for all applets: \n${String(error)}`,
      );
      return {
        appletEntities: {},
      };
    }
  }
}
