import { QueryClient } from '@tanstack/react-query';

import { EventModel } from '@app/entities/event';
import { QueryDataUtils } from '@app/shared/api';
import { Logger } from '@app/shared/lib';
import { SurveyModel } from '@app/widgets/survey';

import { IFlowProgressMigrator } from './FlowProgressMigrationManager';
import { FlowStateV1 } from '../';

type FlowPipelineItem = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
};

export type FlowStateV0 = {
  step: number;
  pipeline: FlowPipelineItem[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

export class FlowProgressMigratorStep1 implements IFlowProgressMigrator {
  private queryDataUtils: QueryDataUtils;

  private static readonly LogName = '[FlowProgressMigratorStep1]: ';

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
    this.migrate = this.migrate.bind(this);
  }

  private parseIDs(storageKey: string) {
    const uuidLength = 36;

    const flowId = storageKey.slice(0, uuidLength);
    const appletId = storageKey.slice(uuidLength + 1, 2 * uuidLength + 1);
    const eventId = storageKey.slice(2 * (uuidLength + 1), 3 * uuidLength + 2);

    if (!(flowId && appletId && eventId)) {
      return undefined;
    }

    return { flowId, appletId, eventId };
  }

  public migrate(prevState: FlowStateV0, storageKey: string): FlowStateV1 {
    const ids = this.parseIDs(storageKey);

    if (!ids) {
      throw Error(
        `${FlowProgressMigratorStep1.LogName} failed to parse the provided storageKey. ${storageKey}`,
      );
    }

    const { appletId, eventId, flowId } = ids;

    const appletDto = this.queryDataUtils.getAppletDto(appletId);

    if (!appletDto) {
      throw Error(
        `${FlowProgressMigratorStep1.LogName} Migration cannot be executed as applet doesn't exist: ${appletId}`,
      );
    }

    const activityFlowDto = appletDto.activityFlows.find(f => f.id === flowId)!;

    const eventDtos = this.queryDataUtils.getEventsDto(appletId)!;

    const eventDto = eventDtos.find(e => e.id === eventId);

    const newState: FlowStateV1 = { ...(prevState as FlowStateV1) };

    newState.flowName = activityFlowDto.name;

    if (eventDto) {
      newState.scheduledDate =
        SurveyModel.getScheduledDate(EventModel.mapEventFromDto(eventDto)) ??
        null;
    } else {
      Logger.warn(
        FlowProgressMigratorStep1.LogName + "Event doesn't exist: " + eventId,
      );
    }

    for (let pipelineItem of newState.pipeline) {
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

    return newState;
  }
}
