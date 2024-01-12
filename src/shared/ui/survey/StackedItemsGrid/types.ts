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

export type AxisItem = {
  id: string;
  tooltip: string | null;
  title: string;
  imageUrl: string | null;
};
