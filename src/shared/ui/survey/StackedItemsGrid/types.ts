type CommonFields = {
  id: string;
  tooltip: string | null;
};

export type Item = CommonFields &
  Partial<{
    rowName: string;
    text: string;
    rowImage: string | null;
    image: string | null;
  }>;

export type StackedRowItemValue = Item;
