import {
  ActivityDto,
  ActivityFlowRecordDto,
  ActivityItemDto,
  ActivityRecordDto,
  AnalyticsAnswerDto,
  AnalyticsResponseType,
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletDto,
  CompletedEntityDto,
  OptionsDto,
  ResponseConfig,
  ThemeDto,
} from '@app/shared/api';
import { buildDateTimeFromDto } from '@app/shared/lib';

import {
  Activity,
  ActivityFlow,
  ActivityResponses,
  AnalyticsAnswer,
  Applet,
  AppletDetails,
  AppletTheme,
  AppletVersion,
  CompletedEntity,
  ResponseAnalyticsValue,
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

type Config = {
  appletId: string;
  activitiesDto?: ActivityDto[];
  answersDto: AnalyticsAnswerDto[];
  encryptionService: {
    decrypt: (json: string) => string;
  };
};

export function mapAppletAnalytics({
  appletId,
  activitiesDto,
  answersDto,
  encryptionService,
}: Config) {
  const activitiesResponses: ActivityResponses[] =
    activitiesDto?.map(activityDto => {
      const activityAnswers = getAnswersByActivityId(
        activityDto.id,
        answersDto,
        encryptionService,
      );

      const analyticsItems = getAnalyticItems(activityDto);

      const analyticsAnswers = mapAnswersWithAnalyticsItems(
        activityAnswers,
        analyticsItems,
      );

      return {
        id: activityDto.id,
        name: activityDto.name,
        description: activityDto.description ?? null,
        responses: mapActivityResponses(analyticsItems, analyticsAnswers),
      };
    }) ?? [];

  return {
    id: appletId,
    activitiesResponses,
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

function getAnswersByActivityId(
  activityId: string,
  answersDto: AnalyticsAnswerDto[],
  encryptionService: {
    decrypt: (text: string) => string;
  },
): AnalyticsAnswerDto[] {
  return answersDto
    .filter(answerDto => answerDto.activityId === activityId)
    .map(x => ({
      answer: JSON.parse(encryptionService.decrypt(x.answer)),
      itemIds: x.itemIds,
      activityId: x.activityId,
      createdAt: x.createdAt,
    }));
}

function getAnalyticItems(activityDto: ActivityDto) {
  return activityDto.items.filter(filterItem =>
    ['multiSelect', 'singleSelect', 'slider'].includes(filterItem.responseType),
  );
}

function mapAnswersWithAnalyticsItems(
  analyticsAnswers: AnalyticsAnswerDto[],
  analyticsItemIds: ActivityItemDto[],
) {
  return analyticsAnswers.flatMap(analyticsAnswer =>
    getAnalyticsItemAnswers(analyticsAnswer, analyticsItemIds),
  );
}

function getAnalyticsItemAnswers(
  analyticsAnswer: AnalyticsAnswerDto,
  analyticsItems: ActivityItemDto[],
): AnalyticsAnswer[] {
  const { itemIds, answer } = analyticsAnswer;

  const analyticsItemAnswers = itemIds
    .map((itemId, index) => {
      const analyticsItem = analyticsItems.find(item => itemId === item.id);

      if (analyticsItem) {
        return {
          itemId,
          answer: answer[index],
          type: analyticsItem?.responseType,
          name: analyticsItem.name,
          createdAt: analyticsAnswer.createdAt,
        };
      }
    })
    .filter(Boolean) as AnalyticsAnswer[];

  return analyticsItemAnswers;
}

function mapActivityResponses(
  items: ActivityItemDto[],
  analyticsAnswers: AnalyticsAnswer[],
) {
  const allItemsResponses = items.map(item =>
    mapActivityResponsesByItem(analyticsAnswers, item),
  );

  return allItemsResponses;
}

function mapActivityResponsesByItem(
  analyticsAnswers: AnalyticsAnswer[],
  item: ActivityItemDto,
) {
  const type = item.responseType as AnalyticsResponseType;

  const responses = analyticsAnswers
    .filter(answer => answer.itemId === item.id)
    .flatMap(answer => {
      return getItemResponses(answer.answer, answer.createdAt, answer.type);
    });

  const itemResponses = {
    name: item.name,
    type: type,
    responseConfig: mapResponseConfig(item, type),
    data: responses,
  };

  return itemResponses;
}

function mapResponseConfig(
  itemDto: ActivityItemDto,
  responseType: AnalyticsResponseType,
): ResponseConfig {
  switch (responseType) {
    case 'multiSelect':
    case 'singleSelect':
      const multiSelectConfig = itemDto.responseValues as {
        options: OptionsDto;
      };

      return {
        options: multiSelectConfig.options.map(option => ({
          name: option.text,
          value: option.value,
        })),
      };
    case 'slider':
      return null;
  }
}

function getItemResponses(
  answer: any,
  createdAt: string,
  responseType: AnalyticsResponseType,
): ResponseAnalyticsValue {
  switch (responseType) {
    case 'multiSelect':
      const multiSelectValue: number[] = answer.value;

      return multiSelectValue?.map(value => ({
        value,
        date: new Date(createdAt),
      }));
    case 'singleSelect':
      const selectItemValue: number = answer.value;
      return [
        {
          value: selectItemValue,
          date: new Date(createdAt),
        },
      ];
    case 'slider':
      const sliderValue: number = answer.value;
      return [
        {
          value: sliderValue,
          date: new Date(createdAt),
        },
      ];
  }
}

export function mapDtoToRespondentMeta(
  response?: AppletDetailsResponse,
): string {
  return response?.respondentMeta?.nickname ?? '';
}
