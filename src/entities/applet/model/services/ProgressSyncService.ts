import { ActivityPipelineType } from '@app/abstract/lib';
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

  private getProgressState() {
    return selectInProgressEntities(this.state);
  }

  private async syncWithAppletDto(appletDto: AppletDetailsDto) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);
    const fromDate = getMonthAgoDate();

    const response = await EventsService.getCompletedEntities({
      fromDate,
      appletId: appletDetails.id,
      version: appletDetails.version,
    });

    const completedEntities = [
      ...response.data.result.activities.map(mapCompletedEntityFromDto),
      ...response.data.result.activityFlows.map(mapCompletedEntityFromDto),
    ];

    completedEntities.map(completedEntity =>
      this.syncAppletEntityWithServer(appletDetails, completedEntity),
    );
  }

  private syncAppletEntityWithServer(
    appletDetails: AppletDetails,
    completedEntity: CompletedEntity,
  ) {
    const inProgressEntities = this.getProgressState();
    const localEndAt =
      inProgressEntities?.[completedEntity.entityId]?.[completedEntity.eventId]
        .endAt;
    const serverEndAt = completedEntity.endAt;

    const entityEventMissing =
      inProgressEntities?.[completedEntity.entityId]?.[completedEntity.eventId];
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
        `[RefreshService.refresh]: Added missing entity event [entityId: ${completedEntity.entityId}, eventId: ${completedEntity.eventId}]`,
      );
    }

    const completedLaterThanFromServer = localEndAt && localEndAt < serverEndAt;

    if (completedLaterThanFromServer) {
      this.dispatch(
        actions.completedEntityUpdated({
          endAt: serverEndAt,
          appletId: appletDetails.id,
          entityId: completedEntity.entityId,
          eventId: completedEntity.eventId,
        }),
      );

      this.logger.log(
        `[RefreshService.refresh]: Updated entity event [entityId: ${completedEntity.entityId}, eventId: ${completedEntity.eventId}] with data from the server`,
      );
    }
  }

  public sync(appletDto: AppletDetailsDto) {
    return this.syncWithAppletDto(appletDto);
  }
}

export default ProgressSyncService;
