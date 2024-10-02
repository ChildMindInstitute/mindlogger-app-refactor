import { CollectRemoteCompletionsResult } from '@entities/applet/model/services/IProgressDataCollector.ts';
import {
  CollectAllAppletAssignmentsResult,
  CollectAllAppletEventsResult,
} from '@entities/applet/model/services/IRefreshDataCollector.ts';
import { RefreshOptimization } from '@entities/applet/model/services/RefreshOptimization.ts';
import { AppletDto } from '@shared/api/services/IAppletService.ts';

export interface IRefreshAppletService {
  refreshApplet(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    allAppletAssignments: CollectAllAppletAssignmentsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
    optimization: RefreshOptimization,
  ): Promise<void>;
}
