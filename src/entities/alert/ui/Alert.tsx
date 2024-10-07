import { PropsWithChildren } from 'react';

import { Image, XStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';
import { bellAlertIcon } from '@assets/images';

type Props = PropsWithChildren;

export function Alert({ children }: Props) {
  return (
    <XStack alignItems="center" mr={25}>
      <Image mt={2} mr={10} width={13} height={16} src={bellAlertIcon} />

      <Text fontSize={16} accessibilityLabel="alert">
        {children}
      </Text>
    </XStack>
  );
}
