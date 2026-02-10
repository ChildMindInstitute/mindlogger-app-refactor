import { getDefaultEventsService } from '@app/shared/api/services/eventsServiceInstance';
import { FeatureFlagsKeys } from '@app/shared/lib/featureFlags/FeatureFlags.types';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
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

    // Only include in-progress flows when feature flag is enabled
    const includeInProgress = getDefaultFeatureFlagsService().evaluateFlag(
      FeatureFlagsKeys.enableCrossDeviceFlowSync,
    );

    return await getDefaultEventsService().getAllCompletedEntities({
      fromDate,
      includeInProgress,
    });
  }

  private async collectInternal(): Promise<CollectRemoteCompletionsResult> {
    const result: CollectRemoteCompletionsResult = {
      appletEntities: {},
    };

    const response = await this.collectAllCompletions();

    response?.data?.result?.forEach(completions => {
      result.appletEntities[completions.id] = completions;
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
