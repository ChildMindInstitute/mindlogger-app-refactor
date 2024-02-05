import { ImageUrl } from '@app/shared/lib';

export type Item = {
  id: string;
  text: string;
  color: string | null;
  isHidden: boolean;
  tooltip: string | null;
  image: ImageUrl | null;
  score: number | null;
  value: number;
  isNoneAbove: boolean;
};
