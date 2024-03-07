import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import { createStorage, Logger } from '@app/shared/lib';
import { getScheduledDate } from '@app/widgets/survey/model';

import {
  FlowProgress0000,
  FlowProgress0001,
  FlowState0000,
  FlowState0001,
  MigrationInput,
  MigrationOutput,
  RootState0000,
} from './MigrationTypes0001';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsDto,
  mapEventFromDto,
  QueryDataUtils,
  selectNotCompletedEntities,
} from './MigrationUtils0001';
import { IMigration } from '../../types';

const flowStorage = createStorage('flow_progress-storage');

export class MigrationToVersion0001 implements IMigration {
  private queryClient: QueryClient;
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private getFlowState = (key: string): FlowState0000 | null => {
    const json = flowStorage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowState0000;
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
    currentActivityDto: ActivityRecordDto,
    flowProgressFrom: FlowProgress0000,
    flowStateFrom: FlowState0000,
  ): FlowProgress0001 {
    const progressTo: FlowProgress0001 = {
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

    return progressTo;
  }

  private getUpdateFlowState(
    flowStateFrom: FlowState0000,
    appletDto: AppletDetailsDto,
    activityFlowDto: ActivityFlowRecordDto,
    eventId: string,
  ): FlowState0001 {
    const flowStateTo = { ...flowStateFrom } as FlowState0001;

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
    const reduxRootStateFrom: RootState0000 = input.redux;

    // todo - check if cache exist ?

    const entitiesInProgress = selectNotCompletedEntities(reduxRootStateFrom);

    for (let progress of entitiesInProgress) {
      const { appletId, entityId, eventId, payload } = progress;

      Logger.info(
        '[MigrationToVersion0001]: Migrating progress: \n' +
          JSON.stringify(progress, null, 2),
      );

      const appletDto = this.queryDataUtils.getAppletDto(appletId);

      if (!appletDto) {
        Logger.warn(
          "[MigrationToVersion0001]: Migration cannot be executed as applet doesn't exist: " +
            appletId,
        );
        continue;
      }

      if (payload.type !== ActivityPipelineType.Flow) {
        continue;
      }

      const activityFlowDto = appletDto.activityFlows.find(
        f => f.id === entityId,
      );

      const key = this.getFlowRecordKey(appletId, entityId, eventId);

      const flowStateFrom: FlowState0000 = this.getFlowState(key)!;

      Logger.info('[MigrationToVersion0001]: Updating flow progress record');

      const flowProgressFrom = payload as FlowProgress0000;

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

      const progressTo: FlowProgress0001 = this.getUpdatedFlowProgress(
        currentActivityDto!,
        flowProgressFrom,
        flowStateFrom,
      );
      console.log(progressTo);

      Logger.info(
        '[MigrationToVersion0001]: Flow progress record updated, action object: \n' +
          JSON.stringify(progressTo, null, 2),
      );

      const flowStateTo = this.getUpdateFlowState(
        flowStateFrom,
        appletDto,
        activityFlowDto,
        eventId,
      );
      console.log(flowStateTo);

      // todo setFlowState(key, flowState);
    }

    return {} as MigrationOutput;
  }
}
