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
    backgroundColor="$error"
    br={10}
    aria-label={accessibilityLabel}
  >
    <Text fontSize={11} fontWeight="700" color="$on_error">
      {text}
    </Text>
  </Box>
);
