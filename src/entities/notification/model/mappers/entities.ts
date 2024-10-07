import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
} from '@app/shared/api/services/IAppletService';

import { Activity, ActivityFlow } from '../../lib/types/notificationBuilder';

export const mapActivitiesFromDto = (
  activityDtos: ActivityRecordDto[],
): Activity[] => {
  const activities: Activity[] = activityDtos.map(x => ({
    description: x.description,
    id: x.id,
    isVisible: !x.isHidden,
    name: x.name,
    pipelineType: ActivityPipelineType.Regular,
  }));
  return activities;
};

export const mapActivityFlowsFromDto = (
  dtos: ActivityFlowRecordDto[],
): ActivityFlow[] => {
  const activityFlows: ActivityFlow[] = dtos.map(x => ({
    description: x.description,
    id: x.id,
    isVisible: !x.isHidden,
    name: x.name,
    pipelineType: ActivityPipelineType.Flow,
  }));
  return activityFlows;
};
