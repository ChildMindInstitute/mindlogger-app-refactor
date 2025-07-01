import { PropsWithChildren } from 'react';
import { Image } from 'react-native';

import { XStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';
import { bellAlertIcon } from '@assets/images';

type Props = PropsWithChildren;

export function Alert({ children }: Props) {
  return (
    <XStack alignItems="center" mr={25}>
      <Image
        width={13}
        height={16}
        source={bellAlertIcon}
        style={{
          marginTop: 2,
          marginRight: 10,
          width: 13,
          height: 16,
        }}
      />

      <Text fontSize={16} accessibilityLabel="alert">
        {children}
      </Text>
    </XStack>
  );
}
