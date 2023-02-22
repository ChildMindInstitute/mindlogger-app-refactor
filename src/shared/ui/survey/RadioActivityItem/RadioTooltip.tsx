import React, { FC, useState } from 'react';

import { Text, RNETooltip } from '@shared/ui';

type TooltipProps = {
  children: React.ReactNode;
  tooltipText: string;
};

const Tooltip: FC<TooltipProps> = ({ children, tooltipText }) => {
  const [isTooltipShown, setTooltipShown] = useState(false);
  return (
    <RNETooltip
      visible={isTooltipShown}
      onOpen={() => setTooltipShown(true)}
      onClose={() => setTooltipShown(false)}
      popover={<Text>{tooltipText}</Text>}
    >
      {children}
    </RNETooltip>
  );
};

export default Tooltip;
