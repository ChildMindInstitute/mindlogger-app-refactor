import { Image } from 'react-native';

import { getFloatPartLength } from '@app/shared/lib/utils/common';
import { Box, XStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';
import { roundAlertIcon } from '@assets/images';

export type Props = {
  label: string;
  value: number;
  highlighted: boolean;
};

export function Score({ label, value, highlighted }: Props) {
  return (
    <XStack alignItems="center">
      {highlighted && (
        <Image
          source={roundAlertIcon}
          width={17}
          height={16}
          style={{
            marginRight: 7,
            width: 17,
            height: 16,
          }}
        />
      )}

      <Text
        mr={8}
        flex={1}
        fontSize={18}
        lineHeight={24}
        fontWeight={highlighted ? '700' : '400'}
        color={highlighted ? '$error' : '$on_surface'}
        aria-label="score-name"
      >
        {label}
      </Text>

      <Box
        br={10}
        bg={highlighted ? '$surface_variant' : '$surface'}
        px={40}
        py={2}
      >
        <Text
          color={highlighted ? '$error' : '$on_surface'}
          fontWeight={highlighted ? '700' : '400'}
          fontSize={22}
          lineHeight={28}
          aria-label="score-value"
        >
          {getFloatPartLength(value) > 2 ? value.toFixed(2) : value}
        </Text>
      </Box>
    </XStack>
  );
}
