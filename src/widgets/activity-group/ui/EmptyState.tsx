import { ReactNode } from 'react';

import { BoxProps, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

type Props = BoxProps & {
  icon: ReactNode;
  description: string;
};

export const EmptyState = ({ icon, description, ...rest }: Props) => {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      py={16}
      gap={16}
      {...rest}
    >
      {icon}
      <Text fontSize={24} lineHeight={32} color="$grey4" textAlign="center">
        {description}
      </Text>
    </YStack>
  );
};
