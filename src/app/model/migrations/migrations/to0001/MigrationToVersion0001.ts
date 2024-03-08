import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import { createStorage, Logger } from '@app/shared/lib';
import { getScheduledDate } from '@app/widgets/survey/model';

import {
  FlowProgressFrom,
  FlowProgressTo,
  FlowStateFrom,
  FlowStateTo,
  RootStateFrom,
  RootStateTo,
  StoreProgressPayloadTo,
} from './MigrationTypes0001';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsDto,
  getUpdatedReduxState,
  mapEventFromDto,
  NotCompletedFlowsFrom,
  NotCompletedFlowsTo,
  QueryDataUtils,
  selectNotCompletedFlows,
} from './MigrationUtils0001';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

const flowStorage = createStorage('flow_progress-storage');

export class MigrationToVersion0001 implements IMigration {
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private getFlowState = (key: string): FlowStateFrom | null => {
    const json = flowStorage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowStateFrom;
    } else {
      return null;
    }
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
    progressFlowFrom: NotCompletedFlowsFrom,
    currentActivityDto: ActivityRecordDto,
    flowProgressFrom: FlowProgressFrom,
    flowStateFrom: FlowStateFrom,
  ): NotCompletedFlowsTo {
    const progressTo: FlowProgressTo = {
      currentActivityDescription:
        currentActivityDto?.description ?? '[Description unknown]',
      currentActivityImage: currentActivityDto?.image ?? null,
      currentActivityName: currentActivityDto?.name ?? '[Name unknown]',
      currentActivityId: flowProgressFrom.currentActivityId,
      currentActivityStartAt: flowProgressFrom.currentActivityStartAt,
      type: ActivityPipelineType.Flow,
      executionGroupKey: flowProgressFrom.executionGroupKey,
      pipelineActivityOrder: flowProgressFrom.pipelineActivityOrder,
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

    Logger.info(
      '[MigrationToVersion0001]: Updating pipeline flow state. Before update:\n' +
        JSON.stringify(flowStateFrom, null, 2),
    );

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
      storagesStates: { ...input.storagesStates },
    };

    const reduxRootStateFrom: RootStateFrom = input.reduxState;

    // todo - check if cache exist ?

    const progressFlowsTo: NotCompletedFlowsTo[] = [];

    const progressFlowsFrom = selectNotCompletedFlows(reduxRootStateFrom);

    for (let progressFlowFrom of progressFlowsFrom) {
      const { appletId, flowId: entityId, eventId, payload } = progressFlowFrom;

      const appletDto = this.queryDataUtils.getAppletDto(appletId);

      if (!appletDto) {
        Logger.warn(
          "[MigrationToVersion0001]: Migration cannot be executed as applet doesn't exist: " +
            appletId,
        );
        continue;
      }

      const activityFlowDto = appletDto.activityFlows.find(
        f => f.id === entityId,
      );

      const key = this.getFlowRecordKey(appletId, entityId, eventId);

      const flowStateFrom: FlowStateFrom = this.getFlowState(key)!;

      const flowProgressFrom = payload as FlowProgressFrom;

      const currentActivityDto = appletDto.activities.find(
        a => a.id === flowProgressFrom.currentActivityId,
      );

      if (!currentActivityDto) {
        Logger.warn(
          "[MigrationToVersion0001]: currentActivity doesn't exist in react-query cache: " +
            flowProgressFrom.currentActivityId,
        );
      }
      if (!activityFlowDto) {
        Logger.warn(
          "[MigrationToVersion0001]: activityFlow doesn't exist: " + entityId,
        );
        continue;
      }

      const progressFlowTo = this.getUpdatedFlowProgress(
        progressFlowFrom,
        currentActivityDto!,
        flowProgressFrom,
        flowStateFrom,
      );

      progressFlowsTo.push(progressFlowTo);

      const flowStateTo = this.getUpdatedFlowState(
        flowStateFrom,
        appletDto,
        activityFlowDto,
        eventId,
      );

      result.storagesStates = {
        ...result.storagesStates,
        'flow_progress-storage': {
          ...result.storagesStates['flow_progress-storage'],
          key: flowStateTo,
        },
      };
    }

    result.reduxState = getUpdatedReduxState(
      reduxRootStateFrom,
      progressFlowsTo,
    );

    return result;
  }
}
