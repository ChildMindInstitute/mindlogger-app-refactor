import { CollectRemoteCompletionsResult } from '@entities/applet/model/services/IProgressDataCollector';
import {
  CollectAllAppletAssignmentsResult,
  CollectAllAppletEventsResult,
} from '@entities/applet/model/services/IRefreshDataCollector';
import { RefreshOptimization } from '@entities/applet/model/services/RefreshOptimization';
import { AppletDto } from '@shared/api/services/IAppletService';

export interface IRefreshAppletService {
  refreshApplet(
    appletDto: AppletDto,
    allAppletEvents: CollectAllAppletEventsResult,
    allAppletAssignments: CollectAllAppletAssignmentsResult,
    appletRemoteCompletions: CollectRemoteCompletionsResult,
    optimization: RefreshOptimization,
  ): Promise<void>;
}
