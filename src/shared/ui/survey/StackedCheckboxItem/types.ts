import { StackedRowItemValue } from '../StackedItemsGrid/types';

type StackedCheckboxConfig = {
  scoring?: boolean;
  itemList: Array<StackedRowItemValue>;
  options: Array<StackedRowItemValue>;
};

export default StackedCheckboxConfig;
