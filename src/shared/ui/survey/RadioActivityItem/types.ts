type RadioOption = {
  id: string;
  text: string;
  image: string | null;
  score: number | null;
  tooltip: string | null;
  color: string | null;
  isHidden: boolean;
};

export default RadioOption;
