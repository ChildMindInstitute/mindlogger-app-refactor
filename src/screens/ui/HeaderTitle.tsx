import { TextProps } from '@tamagui/core';

import { palette } from '@app/shared/lib/constants/palette';
import { Text } from '@app/shared/ui/Text';

export const HeaderTitle = (props: TextProps) => {
  return (
    <Text
      fontSize={16}
      fontWeight="700"
      color={palette.on_surface}
      {...props}
    />
  );
};
