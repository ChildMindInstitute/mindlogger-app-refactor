import React, { FC } from 'react';

import { colors } from '../lib';
import { Text, Popover } from '../ui';

type TooltipProps = {
  children: React.ReactNode;
  tooltipText: string;
};

const Tooltip1: FC<TooltipProps> = ({ children, tooltipText }) => {
  return (
    <Popover placement="bottom" size="$4">
      <Popover.Trigger>{children}</Popover.Trigger>

      {tooltipText && (
        <Popover.Content width="$19" backgroundColor={colors.lighterGrey3}>
          <Text fontSize={18}>{tooltipText}</Text>
        </Popover.Content>
      )}
    </Popover>
  );
};

export default Tooltip1;
