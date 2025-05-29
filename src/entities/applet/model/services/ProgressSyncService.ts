import { AppletDetailsDto } from '@app/shared/api/services/IAppletService';
import {
  CompletedEntityDto,
  EntitiesCompletionsDto,
} from '@app/shared/api/services/IEventsService';
import { ILogger } from '@app/shared/lib/types/logger';
import { buildDateTimeFromDto } from '@app/shared/lib/utils/dateTime';
import { IAppletProgressSyncService } from '@entities/applet/model/services/IAppletProgressSyncService';

import { AppletDetails } from '../../lib/types';
import { mapAppletDetailsFromDto } from '../mappers';
import { appletActions, UpsertEntityProgressionPayload } from '../slice';

export class ProgressSyncService implements IAppletProgressSyncService {
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;

  constructor(state: RootState, dispatch: AppDispatch, logger: ILogger) {
    this.logger = logger;
    this.dispatch = dispatch;
    this.state = state;
  }

  private async syncWithAppletDto(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
  ) {
    const appletDetails = mapAppletDetailsFromDto(appletDto);

    try {
      const { activities, activityFlows } = appletCompletions;

      [...activities, ...activityFlows].forEach(completionDto => {
        this.upsertEntityProgression(appletDetails, completionDto);
      });
    } catch (error) {
      throw new Error(
        '[ProgressSyncService.syncWithAppletDto]: Error occurred during sync progress entities:\n\n' +
          error,
      );
    }
  }

  private upsertEntityProgression(
    appletDetails: AppletDetails,
    completedEntityDto: CompletedEntityDto,
  ) {
    const isFlow = appletDetails.activityFlows.find(
      flow => flow.id === completedEntityDto.id,
    );

    const payload: UpsertEntityProgressionPayload = {
      appletId: appletDetails.id,
      entityType: isFlow ? 'activityFlow' : 'activity',
      entityId: completedEntityDto.id,
      eventId: completedEntityDto.scheduledEventId,
      targetSubjectId: completedEntityDto.targetSubjectId,
      endAt: buildDateTimeFromDto(
        completedEntityDto.localEndDate,
        completedEntityDto.localEndTime,
      ),
      submitId: completedEntityDto.submitId,
    };

    this.dispatch(appletActions.upsertEntityProgression(payload));
    this.logger.log(
      `[ProgressSyncService.upsertEntityProgression]: Upserted progression ${JSON.stringify(payload)}`,
    );
  }

  public sync(
    appletDto: AppletDetailsDto,
    appletCompletions: EntitiesCompletionsDto,
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
