import {
  ActivityPipelineType,
  EntityPath,
  EntityPathParams,
  FlowProgress,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { NotCompletedEntity } from '@app/entities/applet/model/selectors';
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
  private notCompletedEntities: NotCompletedEntity[];

  constructor(notCompletedEntities: NotCompletedEntity[]) {
    this.notCompletedEntities = notCompletedEntities;
  }

  private collectForFlow(
    flowProgress: FlowProgress,
    flowState: FlowState,
    path: EntityPath,
  ): CollectCompletionOutput[] {
    const result: CollectCompletionOutput[] = [];

    const pathParams = {
      flowId: path.entityId,
      appletId: path.appletId,
      eventId: path.eventId,
    };

    const finishItem = flowState.pipeline.slice(-1)[0] as FinishPipelineItem;

    const isCurrentActivityLast =
      flowProgress.pipelineActivityOrder === finishItem.payload.order;

    const { currentActivityId, currentActivityName, pipelineActivityOrder } =
      flowProgress;

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
    progress: StoreProgressPayload,
    flowState: FlowState,
    path: EntityPath,
  ) {
    const result: CollectCompletionOutput[] = [];

    if (path.entityType === 'flow') {
      const collected = this.collectForFlow(
        progress as FlowProgress,
        flowState,
        path,
      );

      collected.forEach(
        x => (x.logAvailableTo = new Date(progress.availableTo!).toString()),
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
        order,
        completionType: 'finish',
        logAvailableTo: new Date(progress.availableTo!).toString(),
      });
    }

    return result;
  }

  public hasExpiredEntity(): boolean {
    Logger.log('[CollectCompletionsService.hasExpiredEntity] Working');

    const filtered: NotCompletedEntity[] = this.notCompletedEntities.filter(
      x => !!x.payload.availableTo,
    );

    for (const notCompletedEntity of filtered) {
      const {
        appletId,
        entityId,
        eventId,
        type,
        payload: progress,
      } = notCompletedEntity;

      const flowId = type === ActivityPipelineType.Flow ? entityId : undefined;

      if (
        isEntityExpired(progress.availableTo) &&
        isCurrentActivityRecordExist(flowId, appletId, eventId)
      ) {
        return true;
      }
    }

    return false;
  }

  public collectForEntity(path: EntityPath): CollectCompletionOutput[] {
    const { entityId, appletId, eventId, entityType } = path;

    const notCompletedEntity = this.notCompletedEntities.find(
      x => x.appletId === appletId && x.eventId === eventId,
    );

    const progress = notCompletedEntity?.payload;

    if (
      !progress ||
      !progress.availableTo ||
      !isEntityExpired(progress.availableTo)
    ) {
      return [];
    }

    const flowId = entityType === 'flow' ? entityId : undefined;

    if (!isCurrentActivityRecordExist(flowId, appletId, eventId)) {
      return [];
    }

    const flowState = getFlowRecord(
      entityType === 'flow' ? entityId : undefined,
      appletId,
      eventId,
    )!;

    return this.collect(progress, flowState, path);
  }

  public collectAll(exclude?: EntityPathParams): CollectCompletionOutput[] {
    Logger.log('[CollectCompletionsService.collectAll] Working');

    const result: CollectCompletionOutput[] = [];

    let filtered: NotCompletedEntity[] = this.notCompletedEntities.filter(
      x => !!x.payload.availableTo,
    );

    if (exclude) {
      filtered = filtered.filter(
        x =>
          !(
            x.appletId === exclude.appletId &&
            x.entityId === exclude.entityId &&
            x.eventId === exclude.eventId
          ),
      );
    }

    for (const notCompletedEntity of filtered) {
      const {
        appletId,
        entityId,
        eventId,
        type,
        payload: progress,
      } = notCompletedEntity;

      const flowId = type === ActivityPipelineType.Flow ? entityId : undefined;

      if (!isEntityExpired(progress.availableTo)) {
        continue;
      }

      if (!isCurrentActivityRecordExist(flowId, appletId, eventId)) {
        continue;
      }

      const flowState: FlowState = getFlowRecord(flowId, appletId, eventId)!;

      result.push(
        ...this.collect(progress, flowState, {
          appletId,
          entityId,
          eventId,
          entityType:
            notCompletedEntity.type === ActivityPipelineType.Flow
              ? 'flow'
              : 'regular',
        }),
      );
    }

    return result;
  }
}
