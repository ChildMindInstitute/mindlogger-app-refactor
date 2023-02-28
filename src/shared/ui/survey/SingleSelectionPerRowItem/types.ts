export type SingleSelectionPerRowItemValue = {
  description: string;
  image: string;
  name: {
    en: string;
  };
};

export type SingleSelectionPerRowConfigType = {
  isOptionalText: boolean;
  multipleChoice: boolean;
  removeBackOption: boolean;
  responseAlert: boolean;
  scoring: boolean;
  itemList: Array<SingleSelectionPerRowItemValue>;
  options: Array<SingleSelectionPerRowItemValue>;
};
