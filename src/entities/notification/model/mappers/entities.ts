import { ActivityPipelineType } from '@app/abstract/lib';
import { ActivityFlowRecordDto, ActivityRecordDto } from '@app/shared/api';

import { Activity, ActivityFlow } from '../../lib';

export const mapActivitiesFromDto = (
  activityDtos: ActivityRecordDto[],
): Activity[] => {
  const activities: Activity[] = activityDtos.map((x) => ({
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
  const activityFlows: ActivityFlow[] = dtos.map((x) => ({
    description: x.description,
    id: x.id,
    isVisible: !x.isHidden,
    name: x.name,
    pipelineType: ActivityPipelineType.Flow,
  }));
  return activityFlows;
};
