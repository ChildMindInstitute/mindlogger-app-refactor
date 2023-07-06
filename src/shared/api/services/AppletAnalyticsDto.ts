export type AnalyticsResponseType = 'singleSelect' | 'multiSelect' | 'slider';

export type ChartItemDto = {
  date: string;
  value: number;
};

export type ResponseAnalyticsDto = Array<ChartItemDto>;

export type SelectionsResponseConfig = {
  options: Array<{ name: string; value: number }>;
};

export type ResponseConfig = SelectionsResponseConfig | null;

export type ItemResponsesDto = {
  name: string;
  type: AnalyticsResponseType;
  data: ResponseAnalyticsDto;
  responseConfig: ResponseConfig;
};

export type ActivityResponsesDto = {
  id: string;
  name: string;
  responses: Array<ItemResponsesDto>;
};

export type AppletAnalyticsDto = {
  appletId: string;
  activitiesResponses?: Array<ActivityResponsesDto>;
};
