import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import { QueryDataUtils } from '@app/shared/api';
import { createStorage, Logger } from '@app/shared/lib';

import { IReduxMigrator } from './ReduxMigrationManager';

import { RootStateV1 } from '.';

type FlowProgressV0 = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
  pipelineActivityOrder: number;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
};

type ActivityProgressV0 = {
  type: ActivityPipelineType.Regular;
};
type EntityProgressV0 = FlowProgressV0 | ActivityProgressV0;
type StoreProgressPayloadV0 = EntityProgressV0 & {
  startAt: number;
  endAt: number | null;
};
type StoreEventsProgressV0 = Record<string, StoreProgressPayloadV0>;
type StoreEntitiesProgressV0 = Record<string, StoreEventsProgressV0>;
type StoreProgressV0 = Record<string, StoreEntitiesProgressV0>;

type StoreProgressV1 = RootStateV1['applets']['inProgress'];

type NotCompletedEntity = {
  type: ActivityPipelineType;
  appletId: string;
  entityId: string;
  eventId: string;
  payload: StoreProgressPayloadV0;
};

type FlowState = {
  step: number;
  flowName: string | null;
  scheduledDate: number | null;
  pipeline: Array<{ type: 'Stepper' | 'Splash' }>;
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

export type RootStateV0 = Omit<RootStateV1, 'applets'> & {
  applets: Omit<RootStateV1['applets'], 'inProgress'> & {
    inProgress: StoreProgressV0;
  };
};

export class ReduxMigratorStep1 implements IReduxMigrator {
  private queryDataUtils: QueryDataUtils;

  private static readonly LogName = '[ReduxMigratorStep1]: ';

  constructor(queryClient: QueryClient) {
    this.migrate = this.migrate.bind(this);
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private selectNotCompletedEntities(state: RootStateV0): NotCompletedEntity[] {
    const inProgressApplets = state.applets.inProgress;
    const result: NotCompletedEntity[] = [];

    const appletIds = Object.keys(inProgressApplets);

    for (let appletId of appletIds) {
      const progressEntities = inProgressApplets[appletId];

      const entityIds = Object.keys(progressEntities);

      for (let entityId of entityIds) {
        const progressEvents = progressEntities[entityId];

        const eventIds = Object.keys(progressEvents);

        for (let eventId of eventIds) {
          const payload = progressEvents[eventId];

          if (payload.endAt) {
            continue;
          }

          result.push({
            appletId,
            entityId,
            eventId,
            type: payload.type,
            payload,
          });
        }
      }
    }

    return result;
  }

  private getFlowState(key: string): FlowState | null {
    const flowStorage = createStorage('flow_progress-storage');

    const json = flowStorage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowState;
    } else {
      return null;
    }
  }

  private getFlowRecordKey(
    appletId: string,
    flowId: string | null,
    eventId: string,
  ) {
    const flowKey = flowId ?? 'default_one_step_flow';

    return `${flowKey}-${appletId}-${eventId}`;
  }

  public migrate(state: RootStateV0): RootStateV1 {
    const entitiesInProgress = this.selectNotCompletedEntities(state);
    const prevEntitiesInProgress = state.applets.inProgress as StoreProgressV1;
    let updatedEntitiesInProgress: StoreProgressV1 = {
      ...prevEntitiesInProgress,
    };

    for (let progress of entitiesInProgress) {
      const { appletId, entityId, eventId, payload } = progress;

      Logger.info(
        ReduxMigratorStep1.LogName +
          'Migrating progress: \n' +
          JSON.stringify(progress, null, 2),
      );

      const appletDto = this.queryDataUtils.getAppletDto(appletId);

      if (!appletDto) {
        Logger.warn(
          ReduxMigratorStep1.LogName +
            "Migration cannot be executed as applet doesn't exist: " +
            appletId,
        );
        continue;
      }

      const isFlow = payload.type === ActivityPipelineType.Flow;

      const activityFlowDto = isFlow
        ? appletDto.activityFlows.find(f => f.id === entityId)
        : null;

      const key = this.getFlowRecordKey(
        appletId,
        isFlow ? entityId : null,
        eventId,
      );

      const flowState: FlowState = this.getFlowState(key)!;

      if (isFlow) {
        Logger.info(
          ReduxMigratorStep1.LogName + 'Updating flow progress record',
        );

        const flowProgress = payload as FlowProgressV0;

        const currentActivityDto = appletDto.activities.find(
          a => a.id === flowProgress.currentActivityId,
        );

        if (!currentActivityDto) {
          Logger.warn(
            ReduxMigratorStep1.LogName +
              "currentActivity doesn't exist in react-query cache: " +
              flowProgress.currentActivityId,
          );
        }
        if (!activityFlowDto) {
          Logger.warn(
            ReduxMigratorStep1.LogName +
              "activityFlow doesn't exist: " +
              entityId,
          );
          continue;
        }

        updatedEntitiesInProgress = {
          ...updatedEntitiesInProgress,
          [appletId]: {
            ...updatedEntitiesInProgress[appletId],
            [entityId]: {
              ...updatedEntitiesInProgress[appletId][entityId],
              [eventId]: {
                type: ActivityPipelineType.Flow,
                currentActivityId: flowProgress.currentActivityId,
                currentActivityStartAt: flowProgress.currentActivityStartAt,
                pipelineActivityOrder: flowProgress.pipelineActivityOrder,
                totalActivitiesInPipeline: flowState.pipeline.filter(
                  x => x.type === 'Stepper',
                ).length,
                currentActivityName:
                  currentActivityDto?.name ?? '[Name unknown]',
                currentActivityDescription:
                  currentActivityDto?.description ?? '[Description unknown]',
                currentActivityImage: currentActivityDto?.image ?? null,
                executionGroupKey: flowProgress.executionGroupKey,
                startAt:
                  updatedEntitiesInProgress[appletId][entityId][eventId]
                    .startAt,
                endAt:
                  updatedEntitiesInProgress[appletId][entityId][eventId].endAt,
              },
            },
          },
        };

        Logger.info(
          ReduxMigratorStep1.LogName +
            'Flow progress record updated, action object: \n' +
            JSON.stringify(
              updatedEntitiesInProgress[appletId][entityId][eventId],
              null,
              2,
            ),
        );
      }
    }

    return {
      ...state,
      applets: {
        ...state.applets,
        inProgress: updatedEntitiesInProgress,
      },
    };
  }
}
