import { StackedRowItemValue } from '../StackedItemsGrid/types';

export type StackedCheckboxConfig = {
  scoring?: boolean;
  itemList: Array<StackedRowItemValue>;
  options: Array<StackedRowItemValue>;
};
