import { ActivityPipelineType, StoreEntitiesProgress } from '@app/abstract/lib';
import {
  AppletCompletedEntitiesResponse,
  AppletDetailsDto,
  AppletDto,
} from '@app/shared/api';
import { ILogger } from '@app/shared/lib';

import { AppletDetails, CompletedEntity } from '../../lib';
import { mapAppletDetailsFromDto, mapCompletedEntityFromDto } from '../mappers';
import { selectInProgressEntities } from '../selectors';
import { actions } from '../slice';

export interface IAppletProgressSyncService {
  sync(
    appletDto: AppletDto,
    appletCompletions: AppletCompletedEntitiesResponse,
  ): Promise<void>;
}

class ProgressSyncService implements IAppletProgressSyncService {
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;

  constructor(state: RootState, dispatch: AppDispatch, logger: ILogger) {
    this.logger = logger;
    this.dispatch = dispatch;
    this.state = state;
  }

  private getProgressState(): StoreEntitiesProgress {
    return selectInProgressEntities(this.state);
  }

  private async syncWithAppletDto(
    appletDto: AppletDetailsDto,
    appletCompletions: AppletCompletedEntitiesResponse,
  ) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);

    try {
      const { activities, activityFlows } = appletCompletions.result;

      const completedEntities: CompletedEntity[] = [
        ...activities.map(mapCompletedEntityFromDto),
        ...activityFlows.map(mapCompletedEntityFromDto),
      ];

      completedEntities.map(completedEntity =>
        this.syncAppletEntityWithServer(appletDetails, completedEntity),
      );
    } catch (error) {
      throw new Error(
        '[ProgressSyncService.syncWithAppletDto]: Error occurred during sync progress entities:\n\n' +
          error,
      );
    }
  }

  private syncAppletEntityWithServer(
    appletDetails: AppletDetails,
    completedEntity: CompletedEntity,
  ) {
    const inProgressEntities = this.getProgressState();
    const progressEntity =
      inProgressEntities?.[completedEntity.entityId]?.[completedEntity.eventId];
    const localEndAt = progressEntity?.endAt;
    const serverEndAt = completedEntity.endAt;

    const entityEventMissing = !progressEntity;
    const isFlow = appletDetails.activityFlows.find(
      flow => flow.id === completedEntity.entityId,
    );

    if (entityEventMissing) {
      this.dispatch(
        actions.completedEntityMissing({
          type: isFlow
            ? ActivityPipelineType.Flow
            : ActivityPipelineType.Regular,
          startAt: 0,
          endAt: serverEndAt,
          appletId: appletDetails.id,
          entityId: completedEntity.entityId,
          eventId: completedEntity.eventId,
        }),
      );

      this.logger.log(
        `[ProgressSyncService.syncAppletEntityWithServer]: Added missing entity event [entityId: ${completedEntity.entityId}, eventId: ${completedEntity.eventId}]`,
      );
    }

    const completedLaterThanOnServer = localEndAt && localEndAt < serverEndAt;

    if (completedLaterThanOnServer) {
      this.dispatch(
        actions.completedEntityUpdated({
          endAt: serverEndAt,
          appletId: appletDetails.id,
          entityId: completedEntity.entityId,
          eventId: completedEntity.eventId,
        }),
      );

      this.logger.log(
        `[ProgressSyncService.syncAppletEntityWithServer]: Updated entity event [entityId: ${completedEntity.entityId}, eventId: ${completedEntity.eventId}] with data from the server`,
      );
    }
  }

  public sync(
    appletDto: AppletDetailsDto,
    appletCompletions: AppletCompletedEntitiesResponse,
  ) {
    try {
      return this.syncWithAppletDto(appletDto, appletCompletions);
    } catch (error) {
      this.logger.warn(
        '[ProgressSyncService.sync]: Error occurred: \nInternal Error: \n\n' +
          error,
      );

      throw error;
    }
  }
}

export default ProgressSyncService;
