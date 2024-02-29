import { colors, getFloatPartLength } from '@app/shared/lib';
import { roundAlertIcon } from '@assets/images';
import { XStack, Image, Text, Box } from '@shared/ui';

export type Props = {
  label: string;
  value: number;
  highlighted: boolean;
};

function Score({ label, value, highlighted }: Props) {
  return (
    <XStack alignItems="center">
      {highlighted && (
        <Image mr={7} src={roundAlertIcon} width={17} height={16} />
      )}

      <Text
        mr={8}
        flex={1}
        fontSize={18}
        fontWeight={highlighted ? 'bold' : 'normal'}
        color={highlighted ? colors.red2 : 'black'}
        accessibilityLabel="score-name"
      >
        {label}
      </Text>

      <Box br={10} bg={highlighted ? '$lighterGrey5' : 'white'} px={40} py={2}>
        <Text
          color={highlighted ? colors.red2 : 'black'}
          fontWeight={highlighted ? 'bold' : 'normal'}
          fontSize={22}
          accessibilityLabel="score-value"
        >
          {getFloatPartLength(value) > 2 ? value.toFixed(2) : value}
        </Text>
      </Box>
    </XStack>
  );
}

export default Score;
