import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import { Logger } from '@app/shared/lib';
import { getScheduledDate } from '@app/widgets/survey/model';

import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsDto,
} from './MigrationDtoTypes0001';
import {
  FlowProgressFrom,
  FlowProgressTo,
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadTo,
} from './MigrationReduxTypes0001';
import { FlowStateFrom, FlowStateTo } from './MigrationStorageTypes0001';
import {
  getUpdatedReduxState,
  mapEventFromDto,
  NotCompletedFlowsFrom,
  NotCompletedFlowsTo,
  QueryDataUtils,
  selectNotCompletedFlows,
} from './MigrationUtils0001';
import {
  IMigration,
  MigrationInput,
  MigrationOutput,
  Storages,
} from '../../types';
import { getStorageRecord, upsertStorageRecord } from '../../utils';

export class MigrationToVersion0001 implements IMigration {
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private getFlowState = (key: string): FlowStateFrom | null => {
    return getStorageRecord(Storages.FlowProgress, key);
  };

  private updateFlowState(key: string, state: FlowStateTo) {
    upsertStorageRecord(Storages.FlowProgress, key, state);
  }

  private getFlowRecordKey = (
    appletId: string,
    flowId: string | null,
    eventId: string,
  ) => {
    const flowKey = flowId ?? 'default_one_step_flow';
    return `${flowKey}-${appletId}-${eventId}`;
  };

  private getUpdatedFlowProgress(
    progressFlowFrom: NotCompletedFlowsFrom,
    currentActivityDto: ActivityRecordDto | undefined,
    flowProgressPayloadFrom: FlowProgressFrom,
    flowStateFrom: FlowStateFrom,
  ): NotCompletedFlowsTo {
    const progressTo: FlowProgressTo = {
      currentActivityDescription:
        currentActivityDto?.description ?? '[Description unknown]',
      currentActivityImage: currentActivityDto?.image ?? null,
      currentActivityName: currentActivityDto?.name ?? '[Name unknown]',
      currentActivityId: flowProgressPayloadFrom.currentActivityId,
      currentActivityStartAt: flowProgressPayloadFrom.currentActivityStartAt,
      type: ActivityPipelineType.Flow,
      executionGroupKey: flowProgressPayloadFrom.executionGroupKey,
      pipelineActivityOrder: flowProgressPayloadFrom.pipelineActivityOrder,
      totalActivitiesInPipeline: flowStateFrom.pipeline.filter(
        x => x.type === 'Stepper',
      ).length,
    };

    const storeProgressPayloadTo: StoreProgressPayloadTo = {
      startAt: progressFlowFrom.payload.startAt,
      endAt: progressFlowFrom.payload.endAt,
      ...progressTo,
    };

    return {
      appletId: progressFlowFrom.appletId,
      eventId: progressFlowFrom.eventId,
      flowId: progressFlowFrom.flowId,
      type: progressFlowFrom.type,
      payload: storeProgressPayloadTo,
    };
  }

  private getUpdatedFlowState(
    flowStateFrom: FlowStateFrom,
    appletDto: AppletDetailsDto,
    activityFlowDto: ActivityFlowRecordDto,
    eventId: string,
  ): FlowStateTo {
    const flowStateTo = { ...flowStateFrom } as FlowStateTo;

    const eventDtos = this.queryDataUtils.getEventsDto(appletDto.id)!;

    const eventDto = eventDtos.find(e => e.id === eventId);

    flowStateTo.flowName = activityFlowDto!.name;

    if (eventDto) {
      flowStateTo.scheduledDate =
        getScheduledDate(mapEventFromDto(eventDto)) ?? null;
    } else {
      Logger.warn("'[MigrationToVersion0001]: Event doesn't exist: " + eventId);
    }

    for (let pipelineItem of flowStateTo.pipeline) {
      const activityDto = appletDto.activities.find(
        a => a.id === pipelineItem.payload.activityId,
      );

      switch (pipelineItem.type) {
        case 'Stepper': {
          pipelineItem.payload.activityName =
            activityDto?.name ?? "'[Name unknown]'";
          pipelineItem.payload.activityDescription =
            activityDto?.description ?? '[Description unknown]';
          pipelineItem.payload.activityImage = activityDto?.image ?? null;
          break;
        }
        case 'Finish':
        case 'Summary':
        case 'Intermediate':
          pipelineItem.payload.activityName =
            activityDto?.name ?? '[Name unknown]';
          break;
      }
    }
    return flowStateTo;
  }

  public migrate(input: MigrationInput): MigrationOutput {
    const result: MigrationOutput = {
      reduxState: { ...input.reduxState } as RootStateTo,
    };

    const reduxRootStateFrom: RootStateFrom = input.reduxState;

    const progressFlowsTo: NotCompletedFlowsTo[] = [];

    const progressFlowsFrom = selectNotCompletedFlows(reduxRootStateFrom);

    for (let progressFlowFrom of progressFlowsFrom) {
      const { appletId, flowId: entityId, eventId, payload } = progressFlowFrom;

      let logAppletName = '',
        logFlowName = '';
      let logFlowStateFrom = '';
      let logCurrentActivityDto = '';
      let logActivityFlowDto = '';
      const logProgressFlowFrom = JSON.stringify(progressFlowFrom, null, 2);

      try {
        const appletDto = this.queryDataUtils.getAppletDto(appletId);

        if (!appletDto) {
          Logger.warn(
            "[MigrationToVersion0001]: Migration cannot be executed as applet doesn't exist: " +
              appletId,
          );
          continue;
        }
        logAppletName = appletDto.displayName;

        const activityFlowDto = appletDto.activityFlows.find(
          f => f.id === entityId,
        );

        if (!activityFlowDto) {
          Logger.warn(
            "[MigrationToVersion0001]: activityFlow doesn't exist: " + entityId,
          );
          continue;
        }
        logFlowName = activityFlowDto.name;
        logActivityFlowDto = JSON.stringify(activityFlowDto, null, 2);

        const key = this.getFlowRecordKey(appletId, entityId, eventId);

        const flowStateFrom: FlowStateFrom = this.getFlowState(key)!;

        logFlowStateFrom = JSON.stringify(flowStateFrom, null, 2);

        const flowProgressPayloadFrom = payload as FlowProgressFrom;

        const currentActivityDto = appletDto.activities.find(
          a => a.id === flowProgressPayloadFrom.currentActivityId,
        );

        if (!currentActivityDto) {
          Logger.warn(
            "[MigrationToVersion0001]: currentActivity doesn't exist in react-query cache: " +
              flowProgressPayloadFrom.currentActivityId,
          );
        }
        logCurrentActivityDto = JSON.stringify(currentActivityDto!, null, 2);

        const progressFlowTo = this.getUpdatedFlowProgress(
          progressFlowFrom,
          currentActivityDto,
          flowProgressPayloadFrom,
          flowStateFrom,
        );

        progressFlowsTo.push(progressFlowTo);

        const flowStateTo = this.getUpdatedFlowState(
          flowStateFrom,
          appletDto,
          activityFlowDto,
          eventId,
        );

        this.updateFlowState(key, flowStateTo);
      } catch (error) {
        Logger.warn(
          `[MigrationToVersion0001.iterate]: Error occurred, appletName=${logAppletName}, flowName=${logFlowName}, progressFlowFrom=${logProgressFlowFrom}, flowStateFrom=${logFlowStateFrom}, currentActivityDto=${logCurrentActivityDto}, activityFlowDto=${logActivityFlowDto}  \nerror: \n${error}`,
        );
      }
    }

    result.reduxState = getUpdatedReduxState(
      reduxRootStateFrom,
      progressFlowsTo,
    );

    return result;
  }
}
