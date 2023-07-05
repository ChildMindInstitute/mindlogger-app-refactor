export type ResponseType = 'singleSelect' | 'multiSelect' | 'slider';

export type SingleSelectDto = Array<{
  date: string;
  value: number | null;
}>;

export type MultipleSelectDto = Array<{
  date: string;
  value: number | null;
}>;

export type SliderDto = Array<{
  date: string;
  value: number | null;
}>;

export type ResponseAnalyticsDto =
  | SingleSelectDto
  | MultipleSelectDto
  | SliderDto;

export type ItemResponsesDto = {
  id: string;
  name: string;
  type: ResponseType;
  data: ResponseAnalyticsDto;
};

export type ActivityAnalyticsDto = {
  id: string;
  name: string;
  description: string;
  itemResponses?: Array<ItemResponsesDto>;
};
