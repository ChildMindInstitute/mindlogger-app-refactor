import { Box, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { Score, Props as ScoreProps } from './Score';

type Props = {
  label: string;
  scores: ScoreProps[];
};

export function ScoreList({ label, scores }: Props) {
  return (
    <Box btw={1} btc="$outline" px={20} aria-label="scores-group">
      <Text
        fontWeight="700"
        fontSize={24}
        lineHeight={32}
        mt={10}
        mb={16}
        aria-label="scores-group-name"
      >
        {label}
      </Text>

      <YStack space={20}>
        {scores.map((score, index) => (
          <Score
            key={index}
            label={score.label}
            value={score.value}
            highlighted={score.highlighted}
          />
        ))}
      </YStack>
    </Box>
  );
}
