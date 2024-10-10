type CommonFields = {
  id: string;
  tooltip: string | null;
};

export type StackedItem = CommonFields &
  Partial<{
    rowName: string;
    text: string;
    rowImage: string | null;
    image: string | null;
  }>;

export type StackedRowItemValue = StackedItem;

export type AxisItem = {
  id: string;
  tooltip: string | null;
  title: string;
  imageUrl: string | null;
};
