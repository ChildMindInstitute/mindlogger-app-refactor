import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AppletDetailsDto,
  AppletDto,
  ThemeDto,
} from '@app/shared/api';

import {
  Activity,
  ActivityFlow,
  Applet,
  AppletDetails,
  AppletTheme,
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
