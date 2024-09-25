import { DayMonthYear, HourMinute } from '@app/shared/lib/types/dateTime';

type AnswerWithAdditionalTextDto<T> = {
  value: T;
  text?: string;
};

type TextAnswerDto = AnswerWithAdditionalTextDto<string>;

type SliderAnswerDto = AnswerWithAdditionalTextDto<number>;

type NumberSelectAnswerDto = AnswerWithAdditionalTextDto<string>;

type StackedSliderAnswerDto = AnswerWithAdditionalTextDto<Array<number>>;

type CheckboxAnswerDto = AnswerWithAdditionalTextDto<string[]>;

type StackedCheckboxAnswerDto = AnswerWithAdditionalTextDto<
  Array<Array<string>>
>;

type RadioAnswerDto = AnswerWithAdditionalTextDto<string>;

type StackedRadioAnswerDto = AnswerWithAdditionalTextDto<Array<string>>;

type AudioAnswerDto = AnswerWithAdditionalTextDto<string>;

type PhotoAnswerDto = AnswerWithAdditionalTextDto<string>;

type VideoAnswerDto = AnswerWithAdditionalTextDto<string>;

type TimeRangeAnswerDto = AnswerWithAdditionalTextDto<{
  from: HourMinute;
  to: HourMinute;
}>;

type TimeAnswerDto = AnswerWithAdditionalTextDto<HourMinute>;

type DateAnswerDto = AnswerWithAdditionalTextDto<DayMonthYear>;

type GeolocationAnswerDto = AnswerWithAdditionalTextDto<{
  latitude: number;
  longitude: number;
}>;

export type AnswerDto =
  | TextAnswerDto
  | SliderAnswerDto
  | NumberSelectAnswerDto
  | StackedSliderAnswerDto
  | StackedCheckboxAnswerDto
  | StackedRadioAnswerDto
  | RadioAnswerDto
  | CheckboxAnswerDto
  | AudioAnswerDto
  | PhotoAnswerDto
  | VideoAnswerDto
  | TimeRangeAnswerDto
  | TimeAnswerDto
  | DateAnswerDto
  | GeolocationAnswerDto;
