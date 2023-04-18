import { ActivityPipelineType } from '@app/abstract/lib';
import { ActivityType } from '@app/entities/activity';
import { ActivityFlowRecordDto, ActivityRecordDto } from '@app/shared/api';

import { Activity, ActivityFlow } from '../lib';

export const mapActivitiesFromDto = (dtos: ActivityRecordDto[]): Activity[] => {
  return dtos.map(dto => ({
    description: dto.description,
    id: dto.id,
    image: dto.image,
    name: dto.name,
    isHidden: dto.isHidden,
    pipelineType: ActivityPipelineType.Regular,
    type: ActivityType.NotDefined,
  }));
};

export const mapActivityFlowsFromDto = (
  dtos: ActivityFlowRecordDto[],
): ActivityFlow[] => {
  return dtos.map(dto => ({
    activityIds: dto.activityIds,
    description: dto.description,
    hideBadge: dto.hideBadge,
    id: dto.id,
    name: dto.name,
    isHidden: dto.isHidden,
    pipelineType: ActivityPipelineType.Flow,
  }));
};
