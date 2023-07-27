import { ImageUrl } from '@app/shared/lib';

export type DataMatrixDto = Array<{
  rowId: string;
  options: Array<{
    optionId: string;
    score: number;
    alert: string | null;
  }>;
}>;

export type RowsDto = Array<{
  id: string;
  label: string;
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: ImageUrl | null;
  maxImage: ImageUrl | null;
  alerts: Array<{
    alert: string;
    maxValue: number | null;
    minValue: number | null;
    value: number;
  }>;
}>;

export type SliderAlertsDto = Array<{
  value: number;
  minValue: number;
  maxValue: number;
  alert: string;
}> | null;

export type OptionsDto = {
  id: string;
  text: string;
  image: string | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
  value: number;
  alert: string | null;
}[];
