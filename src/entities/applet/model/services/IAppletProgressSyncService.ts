import { AppletDto } from '@shared/api/services/IAppletService';
import { EntitiesCompletionsDto } from '@shared/api/services/IEventsService';

export interface IAppletProgressSyncService {
  sync(
    appletDto: AppletDto,
    appletCompletions: EntitiesCompletionsDto,
  ): Promise<void>;
}
