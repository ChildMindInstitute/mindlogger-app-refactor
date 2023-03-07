import { FC } from 'react';

import { Select } from '.';

type DropdownProps = {
  placeholder: string;
  items: Array<number | string>;
  value: number | string;
  onValueChange: (value: number | string) => void;
};

const Dropdown: FC<DropdownProps> = ({
  placeholder,
  value = '',
  onValueChange,
  items,
}) => {
  return (
    <Select value={String(value)} onValueChange={onValueChange}>
      <Select.Trigger>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Select.Content>
        {items?.map((item, index) => (
          <Select.Item index={index} key={item} value={String(value)}>
            <Select.ItemText>{item}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

export default Dropdown;
