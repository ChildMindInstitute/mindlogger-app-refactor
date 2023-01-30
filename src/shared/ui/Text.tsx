import { FC } from 'react';

import { Text as BaseText, TextProps } from '@tamagui/core';

const Text: FC<TextProps> = ({ color = '$black', children, ...props }) => {
  return (
    <BaseText color={color} {...props}>
      {children}
    </BaseText>
  );
};

export default Text;
