import { ImageUrl } from '@app/shared/lib';

type RadioOption = {
  id: string;
  text: string;
  image: ImageUrl | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
};

export default RadioOption;
