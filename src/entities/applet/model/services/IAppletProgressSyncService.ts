import { AppletDto } from '@shared/api/services/IAppletService.ts';
import { EntitiesCompletionsDto } from '@shared/api/services/IEventsService.ts';

export interface IAppletProgressSyncService {
  sync(
    appletDto: AppletDto,
    appletCompletions: EntitiesCompletionsDto,
  ): Promise<void>;
}
