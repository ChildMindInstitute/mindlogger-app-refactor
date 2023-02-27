type OptionName = {
  en: string;
};

type RadioOption = {
  value: string | number;
  name: OptionName;
  color?: string;
  isVisible: boolean;
  description: string;
  image?: string;
};

export default RadioOption;
