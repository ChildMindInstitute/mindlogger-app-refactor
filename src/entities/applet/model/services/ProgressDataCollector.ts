import { AxiosResponse } from 'axios';

import { AppletWithVersion } from '@app/abstract/lib';
import {
  AppletCompletedEntitiesResponse,
  EventsService,
} from '@app/shared/api';
import { ILogger, getMonthAgoDate, splitArrayToBulks } from '@app/shared/lib';

type AppletId = string;

type CollectInput = {
  applets: Array<AppletWithVersion>;
};

type CollectForAppletResult = {
  appletId: AppletId;
  response: AxiosResponse<AppletCompletedEntitiesResponse> | null;
};

export type CollectRemoteCompletionsResult = {
  appletEntities: Record<
    AppletId,
    AxiosResponse<AppletCompletedEntitiesResponse> | null
  >;
};

const BulkSize = 10;

export interface IProgressDataCollector {
  collect(input: CollectInput): Promise<CollectRemoteCompletionsResult>;
}

class ProgressDataCollector implements IProgressDataCollector {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  private async collectForApplet(
    applet: AppletWithVersion,
  ): Promise<CollectForAppletResult> {
    try {
      const fromDate = getMonthAgoDate();

      const response = await EventsService.getCompletedEntities({
        fromDate,
        appletId: applet.appletId,
        version: applet.version,
      });
      return {
        appletId: applet.appletId,
        response,
      };
    } catch (error) {
      return {
        appletId: applet.appletId,
        response: null,
      };
    }
  }

  private async collectInternal(
    applets: Array<AppletWithVersion>,
  ): Promise<CollectRemoteCompletionsResult> {
    const result: CollectRemoteCompletionsResult = {
      appletEntities: {},
    };

    const appletArrays = splitArrayToBulks<AppletWithVersion>(
      BulkSize,
      applets,
    );

    for (let appletsArray of appletArrays) {
      const promises = [];

      for (let applet of appletsArray) {
        promises.push(this.collectForApplet(applet));
      }

      const bulkResults = await Promise.all(promises);

      bulkResults.forEach(r => {
        result.appletEntities[r.appletId] = r.response;
      });
    }

    return result;
  }

  public async collect(
    input: CollectInput,
  ): Promise<CollectRemoteCompletionsResult> {
    try {
      return await this.collectInternal(input.applets);
    } catch (error) {
      this.logger.warn(
        '[ProgressDataCollector.collect]: Error occurred during collect remotely completed entities for all applets',
      );
      return {
        appletEntities: {},
      };
    }
  }
}

export default ProgressDataCollector;
