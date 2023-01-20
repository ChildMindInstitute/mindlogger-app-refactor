import { FC } from 'react';

import { colors } from '@app/shared/lib';
import { Text, YStack } from '@shared/ui';

const AppletsScreen: FC = () => {
  return (
    <YStack
      bg="$secondary"
      flex={1}
      alignItems="center"
      justifyContent="center">
      <Text color={colors.tertiary} fontSize={18}>
        User is logged in
      </Text>

      <Text color={colors.tertiary} fontSize={18}>
        This is mock for applet list
      </Text>
    </YStack>
  );
};

export default AppletsScreen;
