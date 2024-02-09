export type AnalyticsResponseType = 'singleSelect' | 'multiSelect' | 'slider';

export type AnalyticsItemValue = {
  date: string;
  value: number | null;
};

export type ResponseAnalyticsDto = Array<AnalyticsItemValue>;

export type SelectionsResponseConfig = {
  options: Array<{ name: string; value: number }>;
};

export type SliderResponseConfig = {
  maxValue: number;
  minValue: number;
};

export type ResponseConfig = SelectionsResponseConfig | SliderResponseConfig | null;

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

export type AppletAnalyticsDto = any;
