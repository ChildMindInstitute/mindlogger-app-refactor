import { ImageUrl } from '@app/shared/lib';

import { BoxProps } from '../..';

type RadioOption = {
  id: string;
  text: string;
  image: ImageUrl | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
  value: number;
};

export default RadioOption;

export type RadioItemProps = {
  value: string | null;
  options: Array<RadioOption>;

  addTooltip: boolean;
  setPalette: boolean;
  hasImage: boolean;
  hasTooltip: boolean;

  onChange: (newValue: string) => void;
  textReplacer: (markdown: string) => string;
} & BoxProps;
