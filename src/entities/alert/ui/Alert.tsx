import { PropsWithChildren } from 'react';

import { bellAlertIcon } from '@assets/images';
import { XStack, Text, Image } from '@shared/ui';

type Props = PropsWithChildren;

function Alert({ children }: Props) {
  return (
    <XStack alignItems="center" mr={25}>
      <Image mt={2} mr={10} width={13} height={16} src={bellAlertIcon} />
      <Text fontSize={16}>{children}</Text>
    </XStack>
  );
}

export default Alert;
