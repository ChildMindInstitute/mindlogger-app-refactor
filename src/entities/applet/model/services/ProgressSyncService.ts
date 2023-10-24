import { ActivityPipelineType, StoreEntitiesProgress } from '@app/abstract/lib';
import { AppletDetailsDto, EventsService } from '@app/shared/api';
import { getMonthAgoDate, ILogger } from '@app/shared/lib';

import { AppletDetails, CompletedEntity } from '../../lib';
import { mapAppletDetailsFromDto, mapCompletedEntityFromDto } from '../mappers';
import { selectInProgressEntities } from '../selectors';
import { actions } from '../slice';

class ProgressSyncService {
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

  private async syncWithAppletDto(appletDto: AppletDetailsDto) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);
    const fromDate = getMonthAgoDate();

    try {
      const response = await EventsService.getCompletedEntities({
        fromDate,
        appletId: appletDetails.id,
        version: appletDetails.version,
      });

      const completedEntities: CompletedEntity[] = [
        ...response.data.result.activities.map(mapCompletedEntityFromDto),
        ...response.data.result.activityFlows.map(mapCompletedEntityFromDto),
      ];

      completedEntities.map(completedEntity =>
        this.syncAppletEntityWithServer(appletDetails, completedEntity),
      );
    } catch (error) {
      throw new Error(
        '[ProgressSyncService]: Error occurred during getting progress entities from api:\n\n' +
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

  public sync(appletDto: AppletDetailsDto) {
    try {
      return this.syncWithAppletDto(appletDto);
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
