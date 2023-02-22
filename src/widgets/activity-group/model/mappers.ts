import { ActivityType } from '@entities/activity';
import { ActivityFlowRecordDto, ActivityRecordDto } from '@shared/api';

import { Activity, ActivityFlow, ActivityPipelineType } from '../lib';

export function mapActivityFromDto(activity: ActivityRecordDto): Activity {
  return {
    ...activity,
    type: ActivityType.NotDefined,
    pipelineType: ActivityPipelineType.Regular,
  };
}

export function mapActivityFlowFromDto(
  activity: ActivityFlowRecordDto,
): ActivityFlow {
  return {
    ...activity,
    pipelineType: ActivityPipelineType.Flow,
  };
}
