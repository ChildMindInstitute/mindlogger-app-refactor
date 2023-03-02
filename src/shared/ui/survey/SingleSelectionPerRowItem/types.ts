import { StackedRowItemValue } from '../StackedItemsGrid/types';

type SelectionPerRowConfigType = {
  scoring?: boolean;
  itemList: Array<StackedRowItemValue>;
  options: Array<StackedRowItemValue>;
};

export default SelectionPerRowConfigType;
