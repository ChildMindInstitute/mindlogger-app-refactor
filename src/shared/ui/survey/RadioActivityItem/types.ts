import { ImageUrl } from '@app/shared/lib/types/url';
import { RadioGroupProps } from '@tamagui/radio-group';

export type RadioOption = {
  id: string;
  text: string;
  image: ImageUrl | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
  value: number;
};

export type RadioItemProps = {
  value: string | null;
  options: Array<RadioOption>;

  addTooltip: boolean;
  setPalette: boolean;
  hasImage: boolean;
  hasTooltip: boolean;

  onChange: (newValue: string) => void;
  textReplacer: (markdown: string) => string;
} & Omit<RadioGroupProps, 'value'>;
