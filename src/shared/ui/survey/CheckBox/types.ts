import { ImageUrl } from '@app/shared/lib';

import { BoxProps } from '../..';

export type Item = {
  id: string;
  text: string;
  color: string | null;
  isHidden: boolean;
  tooltip: string | null;
  image: ImageUrl | null;
  score: number | null;
  value: number;
  isNoneOption?: boolean;
};

export type CheckboxItemProps = {
  value: Array<Item>;
  options: Array<Item>;

  addTooltip: boolean;
  setPalette: boolean;
  hasImage: boolean;
  hasTooltip: boolean;

  onChange: (newValue: Item) => void;
  textReplacer: (markdown: string) => string;
} & BoxProps;
