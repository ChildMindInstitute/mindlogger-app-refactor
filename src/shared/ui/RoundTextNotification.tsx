import React, { FC } from 'react';

import { Box, Text } from '@app/shared/ui';

type Props = {
  text: string;
};

const RoundTextNotification: FC<Props> = ({ text }: Props) => (
  <Box
    w={20}
    height={20}
    ai="center"
    jc="center"
    backgroundColor="$alert"
    br={10}>
    <Text fontSize={11} fontWeight="700" color="$secondary">
      {text}
    </Text>
  </Box>
);

export default RoundTextNotification;
