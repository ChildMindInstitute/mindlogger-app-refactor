export type GridProps<TItem extends { id: string }> = {
  data: Array<TItem>;
  cellWidth: number;
  space: number;

  renderItem: (item: TItem) => JSX.Element;
};
