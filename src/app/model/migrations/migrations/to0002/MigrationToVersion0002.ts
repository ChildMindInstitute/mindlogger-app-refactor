import { Logger } from '@app/shared/lib';

import {
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadTo,
} from './MigrationReduxTypes0002.ts';
import { FlowStateFrom } from './MigrationStorageTypes0002.ts';
import {
  getUpdatedReduxState,
  selectNotCompletedEntities,
} from './MigrationUtils0002';
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
    const progressFlowsFrom = selectNotCompletedEntities(reduxState, 'flows');
    const progressFlowsTo: NotCompletedEntitiesTo[] = [];
    let logFlowName = '';
    let logFlowStateFrom = '';

    for (const progressFlowFrom of progressFlowsFrom) {
      const logProgressFlowFrom = JSON.stringify(progressFlowFrom, null, 2);

      const { appletId, entityId, eventId } = progressFlowFrom;

      try {
        const key = this.getFlowRecordKey(appletId, entityId, eventId);
        const flowState = this.getFlowState(key)!;

        if (!flowState) {
          Logger.warn(
            `[MigrationToVersion0002.getUpdatedProgressForFlows]: Migration cannot be executed as flowState doesn't exist appletId=${appletId}, entityId=${entityId}, eventId=${eventId}`,
          );
          continue;
        }

        logFlowStateFrom = JSON.stringify(flowState, null, 2);
        logFlowName = flowState?.flowName;
        const flowName = flowState?.flowName ?? '[Name unknown]';

        const progressFlowTo = this.getUpdatedFlowProgress(
          progressFlowFrom,
          flowName,
        );

        progressFlowsTo.push(progressFlowTo);
      } catch (error) {
        Logger.warn(
          `[MigrationToVersion0002.getUpdatedProgressForFlows]: Error occurred flowName=${logFlowName}, progressFlowFrom=${logProgressFlowFrom}, flowState=${logFlowStateFrom} \nerror: \n${error}`,
        );
      }
    }

    return progressFlowsTo;
  }

  private getUpdatedProgressForActivities(
    reduxState: RootStateFrom,
  ): NotCompletedEntitiesTo[] {
    const progressActivitiesFrom = selectNotCompletedEntities(
      reduxState,
      'activities',
    );

    const progressActivitiesTo: NotCompletedEntitiesTo[] = [];
    let logActivityName = '';
    let logFlowStateFrom = '';

    for (const progressActivityFrom of progressActivitiesFrom) {
      const logProgressFlowFrom = JSON.stringify(progressActivityFrom, null, 2);
      const { appletId, entityId, eventId } = progressActivityFrom;

      try {
        const key = this.getFlowRecordKey(appletId, null, eventId);
        const flowState = this.getFlowState(key)!;

        if (!flowState) {
          Logger.warn(
            `[MigrationToVersion0002.getUpdatedProgressForActivities]: Migration cannot be executed as flowState doesn't exist appletId=${appletId}, entityId=${entityId}, eventId=${eventId}`,
          );
          continue;
        }

        logFlowStateFrom = JSON.stringify(flowState, null, 2);
        logActivityName = flowState?.pipeline?.[0]?.payload?.activityName;

        const activityName =
          flowState?.pipeline?.[0]?.payload?.activityName ?? '[Name unknown]';

        const progressActivityTo = this.getUpdatedActivityProgress(
          progressActivityFrom,
          activityName,
        );

        progressActivitiesTo.push(progressActivityTo);
      } catch (error) {
        Logger.warn(
          `[MigrationToVersion0002.getUpdatedProgressForActivities]: Error occurred activityName=${logActivityName}, progressFlowFrom=${logProgressFlowFrom}, flowState=${logFlowStateFrom} \nerror: \n${error}`,
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
