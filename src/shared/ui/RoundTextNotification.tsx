import React, { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { Box } from './base';
import { Text } from './Text';

type Props = {
  text: string;
} & AccessibilityProps;

export const RoundTextNotification: FC<Props> = ({
  text,
  accessibilityLabel,
}: Props) => (
  <Box
    w={20}
    height={20}
    ai="center"
    jc="center"
    backgroundColor="$alert"
    br={10}
    accessibilityLabel={accessibilityLabel}
  >
    <Text fontSize={11} fontWeight="700" color="$secondary">
      {text}
    </Text>
  </Box>
);
