import { TextProps } from '@tamagui/core';

import { colors } from '@app/shared/lib/constants/colors';
import { Text } from '@app/shared/ui/Text';

export const HeaderTitle = (props: TextProps) => {
  return (
    <Text fontSize={16} fontWeight="700" color={colors.white} {...props} />
  );
};
