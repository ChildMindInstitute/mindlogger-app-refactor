import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { styled } from '@tamagui/core';

import { Text, RNETooltip } from '@shared/ui';

import { colors } from '../lib';

const tooltipStyles = StyleSheet.create({
  tooltipTextContainer: {
    width: '70%',
  },
});

type TooltipProps = {
  children: React.ReactNode;
  tooltipText: string;
};

const TooltipText = styled(Text, {
  fontSize: 18,
});

const Tooltip: FC<TooltipProps> = ({ children, tooltipText }) => {
  const [isTooltipShown, setTooltipShown] = useState(false);

  return (
    <RNETooltip
      visible={isTooltipShown}
      onOpen={() => setTooltipShown(true)}
      onClose={() => setTooltipShown(false)}
      backgroundColor={colors.lighterGrey3}
      height={60}
      containerStyle={tooltipStyles.tooltipTextContainer}
      pointerColor={colors.lighterGrey3}
      popover={<TooltipText>{tooltipText}</TooltipText>}
    >
      {children}
    </RNETooltip>
  );
};

export default Tooltip;
