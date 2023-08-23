import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  ActivityResponsesDto,
  AnalyticsResponseType,
  AppletAnalyticsDto,
  AppletDetailsDto,
  AppletDto,
  CompletedEntityDto,
  ItemResponsesDto,
  ResponseAnalyticsDto,
  ThemeDto,
} from '@app/shared/api';
import { buildDateTimeFromDto } from '@app/shared/lib';

import {
  Activity,
  ActivityFlow,
  ActivityResponses,
  Applet,
  AppletAnalytics,
  AppletDetails,
  AppletTheme,
  AppletVersion,
  CompletedEntity,
  ItemResponses,
} from '../lib';

export function mapThemeFromDto(dto: ThemeDto | null): AppletTheme | null {
  return dto === null
    ? null
    : {
        backgroundImage: dto.backgroundImage,
        logo: dto.logo,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        tertiaryColor: dto.tertiaryColor,
      };
}

export function mapActivityFlowFromDto(
  dto: ActivityFlowRecordDto,
): ActivityFlow {
  return {
    activityIds: dto.activityIds,
    description: dto.description,
    id: dto.id,
    image: null,
    name: dto.name,
  };
}

export function mapActivityFlowsFromDto(
  dtos: ActivityFlowRecordDto[],
): ActivityFlow[] {
  return dtos.map(x => mapActivityFlowFromDto(x));
}

export function mapActivityFromDto(dto: ActivityRecordDto): Activity {
  return {
    description: dto.description,
    id: dto.id,
    image: dto.image,
    name: dto.name,
  };
}

export function mapActivitiesFromDto(dtos: ActivityRecordDto[]): Activity[] {
  return dtos.map(x => mapActivityFromDto(x));
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
    activities: mapActivitiesFromDto(detailsDto.activities),
    activityFlows: mapActivityFlowsFromDto(detailsDto.activityFlows),
    theme: mapThemeFromDto(detailsDto.theme),
    encryption: detailsDto.encryption,
  };
}

export function mapApplets(dto: AppletDto[]): Applet[] {
  return dto.map(x => ({
    description: x.description,
    displayName: x.displayName,
    id: x.id,
    image: x.image,
    theme: x.theme,
    numberOverdue: 0,
  }));
}

export function mapAnalyticsData(
  type: AnalyticsResponseType,
  data: ResponseAnalyticsDto,
) {
  switch (type) {
    case 'multiSelect':
    case 'singleSelect':
    case 'slider':
      return data.map(d => ({ date: new Date(d.date), value: d.value }));
  }
}

export function mapItemResponses(
  dtos: Array<ItemResponsesDto>,
): Array<ItemResponses> {
  return dtos.map(r => ({
    name: r.name,
    type: r.type,
    responseConfig: r.responseConfig,
    data: mapAnalyticsData(r.type, r.data),
  }));
}

export function mapActivitiesResponses(
  dtos?: Array<ActivityResponsesDto>,
): Array<ActivityResponses> | null {
  return !dtos
    ? null
    : dtos.map(r => ({
        id: r.id,
        name: r.name,
        responses: mapItemResponses(r.responses),
      }));
}

export function mapAppletAnalytics(
  dto?: AppletAnalyticsDto,
): AppletAnalytics | null {
  if (!dto) {
    return null;
  }

  return {
    id: dto.appletId,
    activitiesResponses: mapActivitiesResponses(dto.activitiesResponses),
  };
}

export function mapAppletDtoToAppletVersion(dto: AppletDto): AppletVersion {
  return {
    version: dto.version,
    appletId: dto.id,
  };
}

export function mapCompletedEntityFromDto(
  dto: CompletedEntityDto,
): CompletedEntity {
  return {
    eventId: dto.scheduledEventId,
    entityId: dto.id,
    endAt: buildDateTimeFromDto(dto.localEndDate, dto.localEndTime).valueOf(),
  };
}
