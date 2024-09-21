import {
  EntityPath,
  EntityPathParams,
  EntityProgressionEntityType,
  EntityProgressionInProgress,
  EntityProgressionInProgressActivityFlow,
} from '@app/abstract/lib';
import { IncompleteEntity } from '@app/entities/applet/model/selectors';
import { isEntityExpired, Logger } from '@app/shared/lib';

import { FinishPipelineItem } from '..';
import {
  getFlowRecord,
  isCurrentActivityRecordExist,
} from '../../lib/storageHelpers';
import { FlowState } from '../../lib/useFlowStorageRecord';

export type CollectCompletionOutput = {
  appletId: string;
  activityId: string;
  flowId: string | undefined;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
  activityName: string;
  completionType: 'intermediate' | 'finish';
  logAvailableTo?: string;
};

export interface ICollectCompletionsService {
  collectForEntity(path: EntityPath): CollectCompletionOutput[];
  collectAll(exclude?: EntityPathParams): CollectCompletionOutput[];
  hasExpiredEntity(): boolean;
}

export class CollectCompletionsService implements ICollectCompletionsService {
  private incompleteEntities: IncompleteEntity[];

  constructor(incompleteEntities: IncompleteEntity[]) {
    this.incompleteEntities = incompleteEntities;
  }

  private collectForFlow(
    flowEntityProgression: EntityProgressionInProgressActivityFlow,
    flowState: FlowState,
    path: EntityPath,
  ): CollectCompletionOutput[] {
    const result: CollectCompletionOutput[] = [];

    const pathParams = {
      flowId: path.entityId,
      appletId: path.appletId,
      eventId: path.eventId,
      targetSubjectId: path.targetSubjectId,
    };

    const finishItem = flowState.pipeline.slice(-1)[0] as FinishPipelineItem;

    const isCurrentActivityLast =
      flowEntityProgression.pipelineActivityOrder === finishItem.payload.order;

    const { currentActivityId, currentActivityName, pipelineActivityOrder } =
      flowEntityProgression;

    result.push({
      ...pathParams,
      activityId: currentActivityId,
      activityName: currentActivityName,
      order: pipelineActivityOrder,
      completionType: isCurrentActivityLast ? 'finish' : 'intermediate',
    });

    if (!isCurrentActivityLast) {
      const { activityId, activityName, order } = finishItem.payload;

      result.push({
        ...pathParams,
        activityId,
        activityName,
        order,
        completionType: 'finish',
      });
    }

    return result;
  }

  private collect(
    progression: EntityProgressionInProgress,
    flowState: FlowState,
    path: EntityPath,
  ) {
    const result: CollectCompletionOutput[] = [];

    if (path.entityType === 'flow') {
      const collected = this.collectForFlow(
        progression as EntityProgressionInProgressActivityFlow,
        flowState,
        path,
      );

      collected.forEach(
        x =>
          (x.logAvailableTo = new Date(
            progression.availableUntilTimestamp!,
          ).toString()),
      );

      result.push(...collected);
    }

    if (path.entityType === 'regular') {
      const { activityId, activityName, order } =
        flowState.pipeline[flowState.step].payload;

      result.push({
        flowId: undefined,
        appletId: path.appletId,
        eventId: path.eventId,
        activityId,
        activityName,
        targetSubjectId: path.targetSubjectId,
        order,
        completionType: 'finish',
        logAvailableTo: new Date(
          progression.availableUntilTimestamp!,
        ).toString(),
      });
    }

    return result;
  }

  public hasExpiredEntity(): boolean {
    Logger.log('[CollectCompletionsService.hasExpiredEntity] Working');

    const filtered = this.incompleteEntities.filter(incompleteEntity => {
      return (
        !!incompleteEntity.progression.availableUntilTimestamp &&
        incompleteEntity.progression.availableUntilTimestamp > 0
      );
    });

    for (const incompleteEntity of filtered) {
      const {
        entityType,
        appletId,
        entityId,
        eventId,
        targetSubjectId,
        progression,
      } = incompleteEntity;

      const flowId = entityType === 'activityFlow' ? entityId : undefined;

      if (
        isEntityExpired(progression.availableUntilTimestamp) &&
        isCurrentActivityRecordExist(flowId, appletId, eventId, targetSubjectId)
      ) {
        return true;
      }
    }

    return false;
  }

  public collectForEntity(path: EntityPath): CollectCompletionOutput[] {
    const { entityId, appletId, eventId, entityType, targetSubjectId } = path;

    const entity = this.incompleteEntities.find(incompleteEntity => {
      return (
        incompleteEntity.appletId === appletId &&
          incompleteEntity.entityType ===
            ((entityType === 'flow'
              ? 'activityFlow'
              : 'activity') as EntityProgressionEntityType),
        incompleteEntity.entityId === entityId &&
          incompleteEntity.eventId === eventId &&
          incompleteEntity.targetSubjectId === targetSubjectId
      );
    });

    const entityProgression = entity?.progression;

    if (
      !entityProgression ||
      !entityProgression.availableUntilTimestamp ||
      entityProgression.availableUntilTimestamp <= 0 ||
      !isEntityExpired(entityProgression.availableUntilTimestamp)
    ) {
      return [];
    }

    const flowId = entityType === 'flow' ? entityId : undefined;

    if (
      !isCurrentActivityRecordExist(flowId, appletId, eventId, targetSubjectId)
    ) {
      return [];
    }

    const flowState = getFlowRecord(
      entityType === 'flow' ? entityId : undefined,
      appletId,
      eventId,
      targetSubjectId,
    )!;

    return this.collect(entityProgression, flowState, path);
  }

  public collectAll(exclude?: EntityPathParams): CollectCompletionOutput[] {
    Logger.log('[CollectCompletionsService.collectAll] Working');

    const result: CollectCompletionOutput[] = [];

    let filtered = this.incompleteEntities.filter(incompleteEntity => {
      return (
        !!incompleteEntity.progression.availableUntilTimestamp &&
        incompleteEntity.progression.availableUntilTimestamp > 0
      );
    });

    if (exclude) {
      filtered = filtered.filter(
        x =>
          !(
            x.appletId === exclude.appletId &&
            x.entityId === exclude.entityId &&
            x.eventId === exclude.eventId &&
            x.targetSubjectId === exclude.targetSubjectId
          ),
      );
    }

    for (const notCompletedEntity of filtered) {
      const {
        entityType,
        appletId,
        entityId,
        eventId,
        targetSubjectId,
        progression,
      } = notCompletedEntity;

      const flowId = entityType === 'activityFlow' ? entityId : undefined;

      if (!isEntityExpired(progression.availableUntilTimestamp)) {
        continue;
      }

      if (
        !isCurrentActivityRecordExist(
          flowId,
          appletId,
          eventId,
          targetSubjectId,
        )
      ) {
        continue;
      }

      const flowState: FlowState = getFlowRecord(
        flowId,
        appletId,
        eventId,
        targetSubjectId,
      )!;

      result.push(
        ...this.collect(progression, flowState, {
          appletId,
          entityId,
          eventId,
          entityType: entityType === 'activityFlow' ? 'flow' : 'regular',
          targetSubjectId,
        }),
      );
    }

    return result;
  }
}
