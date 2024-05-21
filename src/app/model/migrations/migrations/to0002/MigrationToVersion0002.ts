import { QueryClient } from '@tanstack/react-query';

import { Logger } from '@app/shared/lib';

import {
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadTo,
} from './MigrationReduxTypes0002.ts';
import { FlowStateFrom } from './MigrationStorageTypes0002.ts';
import {
  getUpdatedReduxState,
  selectNotCompletedActivities,
  selectNotCompletedFlows,
} from './MigrationUtils0002';
import { QueryDataUtils } from './MigrationUtils0002.ts';
import {
  NotCompletedEntitiesFrom,
  NotCompletedEntitiesTo,
} from './MigrationUtils0002.ts';
import {
  IMigration,
  MigrationInput,
  MigrationOutput,
  Storages,
} from '../../types';
import { getStorageRecord } from '../../utils.ts';

export class MigrationToVersion0002 implements IMigration {
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private getFlowState = (key: string): FlowStateFrom | null => {
    return getStorageRecord(Storages.FlowProgress, key);
  };

  private getFlowRecordKey = (
    appletId: string,
    flowId: string | null,
    eventId: string,
  ) => {
    const flowKey = flowId ?? 'default_one_step_flow';
    return `${flowKey}-${appletId}-${eventId}`;
  };

  private getUpdatedFlowProgress(
    progressFlowFrom: NotCompletedEntitiesFrom,
    entityName: string,
  ): NotCompletedEntitiesTo {
    const storeProgressPayloadTo: StoreProgressPayloadTo = {
      ...progressFlowFrom.payload,
      entityName: entityName,
    };

    return {
      appletId: progressFlowFrom.appletId,
      eventId: progressFlowFrom.eventId,
      entityId: progressFlowFrom.entityId,
      type: progressFlowFrom.type,
      payload: storeProgressPayloadTo,
    };
  }

  private getUpdatedActivityProgress(
    progressFlowFrom: NotCompletedEntitiesFrom,
    entityName: string,
  ): NotCompletedEntitiesTo {
    const storeProgressPayloadTo: StoreProgressPayloadTo = {
      ...progressFlowFrom.payload,
      entityName: entityName,
    };

    return {
      appletId: progressFlowFrom.appletId,
      eventId: progressFlowFrom.eventId,
      entityId: progressFlowFrom.entityId,
      type: progressFlowFrom.type,
      payload: storeProgressPayloadTo,
    };
  }
  private getUpdatedProgressForFlows(
    reduxState: RootStateFrom,
  ): NotCompletedEntitiesTo[] {
    const progressFlowsFrom = selectNotCompletedFlows(reduxState);
    const progressFlowsTo: NotCompletedEntitiesTo[] = [];

    for (const progressFlowFrom of progressFlowsFrom) {
      const { appletId, entityId, eventId } = progressFlowFrom;

      const logAppletName = '',
        logFlowName = '';
      const logFlowStateFrom = '';
      const logCurrentActivityDto = '';
      const logActivityFlowDto = '';
      const logProgressFlowFrom = JSON.stringify(progressFlowFrom, null, 2);

      try {
        const key = this.getFlowRecordKey(appletId, entityId, eventId);

        const flowStateFrom = this.getFlowState(key)!;

        if (!flowStateFrom) {
          Logger.warn(
            `[MigrationToVersion0002.getUpdatedProgressForFlows]: Migration cannot be executed as flowState doesn't exist appletName=${logAppletName}, appletId=${appletId}, entityId=${entityId}, eventId=${eventId}`,
          );
          continue;
        }
        const flowName = flowStateFrom.flowName;

        const progressFlowTo = this.getUpdatedFlowProgress(
          progressFlowFrom,
          flowName,
        );

        progressFlowsTo.push(progressFlowTo);
      } catch (error) {
        Logger.warn(
          `[MigrationToVersion0002.getUpdatedProgressForFlows]: Error occurred, appletName=${logAppletName}, flowName=${logFlowName}, progressFlowFrom=${logProgressFlowFrom}, flowStateFrom=${logFlowStateFrom}, currentActivityDto=${logCurrentActivityDto}, activityFlowDto=${logActivityFlowDto}  \nerror: \n${error}`,
        );
      }
    }

    return progressFlowsTo;
  }

  private getUpdatedProgressForActivities(
    reduxState: RootStateFrom,
  ): NotCompletedEntitiesTo[] {
    const progressActivitiesFrom = selectNotCompletedActivities(reduxState);
    const progressActivitiesTo = [];

    for (const progressActivityFrom of progressActivitiesFrom) {
      const { appletId, entityId } = progressActivityFrom;
      let logAppletName = '',
        logActivityName = '';
      const logActivityStateFrom = '';
      const logCurrentActivityDto = '';
      const logActivityActivityDto = '';
      const logProgressActivityFrom = JSON.stringify(
        progressActivityFrom,
        null,
        2,
      );

      try {
        const appletDto = this.queryDataUtils.getAppletDto(appletId);

        if (!appletDto) {
          Logger.warn(
            "[MigrationToVersion0002.getUpdatedProgressForActivities]: Migration cannot be executed as applet doesn't exist: " +
              appletId,
          );
          continue;
        }
        logAppletName = appletDto.displayName;

        const activityDto = appletDto.activities.find(f => f.id === entityId);

        if (!activityDto) {
          Logger.warn(
            "[MigrationToVersion0002.getUpdatedProgressForActivities]: activityFlow doesn't exist: " +
              entityId,
          );
          continue;
        }

        logActivityName = activityDto.name;

        const progressActivityTo = this.getUpdatedActivityProgress(
          progressActivityFrom,
          activityDto.name,
        );

        progressActivitiesTo.push(progressActivityTo);
      } catch (error) {
        Logger.warn(
          `[MigrationToVersion0002.getUpdatedProgressForActivities]: Error occurred, appletName=${logAppletName}, flowName=${logActivityName}, progressActivityFrom=${logProgressActivityFrom}, flowStateFrom=${logActivityStateFrom}, currentActivityDto=${logCurrentActivityDto}, activityActivityDto=${logActivityActivityDto}  \nerror: \n${error}`,
        );
      }
    }

    return progressActivitiesTo;
  }

  private getUpdatedProgress(
    reduxState: RootStateFrom,
  ): NotCompletedEntitiesTo[] {
    const activitiesProgressTo =
      this.getUpdatedProgressForActivities(reduxState);
    const flowsProgressTo = this.getUpdatedProgressForFlows(reduxState);

    return [...activitiesProgressTo, ...flowsProgressTo];
  }

  migrate(input: MigrationInput): MigrationOutput {
    const result: MigrationOutput = {
      reduxState: { ...input.reduxState } as RootStateTo,
    };

    const reduxRootStateFrom: RootStateFrom = input.reduxState as RootStateFrom;

    const progressTo = this.getUpdatedProgress(reduxRootStateFrom);
    result.reduxState = getUpdatedReduxState(reduxRootStateFrom, progressTo);

    return result;
  }
}

export default MigrationToVersion0002;
