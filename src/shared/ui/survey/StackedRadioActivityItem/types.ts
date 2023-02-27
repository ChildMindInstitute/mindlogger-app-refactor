export type StackedRadioListItemValue = {
  description: string;
  image: string;
  name: {
    en: string;
  };
};

export type StackedConfigType = {
  isOptionalText: boolean;
  multipleChoice: boolean;
  removeBackOption: boolean;
  responseAlert: boolean;
  scoring: boolean;
  itemList: Array<StackedRadioListItemValue>;
  options: Array<StackedRadioListItemValue>;
};
