/*import { ActivityType } from '@app/entities/activity';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsDto,
  ThemeDto,
} from '@shared/api';

import { Activity, ActivityPipelineType } from '../lib';

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

export function mapThemeFromDto(theme: ThemeDto | null): AppletTheme | null {
  return theme === null ? null : { ...theme };
}

export function mapAppletDetailsFromDto(
  detailsDto: AppletDetailsDto,
): AppletDetails {
  return {
    id: detailsDto.id,
    about: detailsDto.about,
    description: detailsDto.description,
    displayName: detailsDto.displayName,
    image: detailsDto.image,
    version: detailsDto.version,
    watermark: detailsDto.watermark,
    activities: detailsDto.activities.map(x => mapActivityFromDto(x)),
    activityFlows: detailsDto.activityFlows.map(x => mapActivityFlowFromDto(x)),
    theme: mapThemeFromDto(detailsDto.theme),
  };
}*/
export const mock = null;
